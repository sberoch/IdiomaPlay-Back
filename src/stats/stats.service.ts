import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOperator, MoreThan, Repository } from 'typeorm';
import { CreateExamStatDto } from './dto/create-stat.dto';
import { CreateUserStatDto } from './dto/create-user-stat.dto';
import { StatsParams } from './dto/stats.params';
import { ExamStat } from './entities/exam-stat.entity';
import { UnitStat } from './entities/unit-stat.entity';
import { UserStat } from './entities/user-stat.entity';

const MAX_DAYS_DIFF = 90;
const categories = {
  daily: 'Diariamente',
  weekly: 'Semanalmente',
  monthly: 'Mensual',
  anualy: 'Anual',
};

interface ActiveUserEntry {
  date: Date;
  amountOfUsers: number;
}

interface RecentUserEntry {
  userId: number;
  date: Date;
  category: string;
}

interface UsersByCategory {
  category: string;
  amountOfUsers: number;
}

function dateDiffInDays(date1, date2) {
  const diffInMs = date1.getTime() - date2.getTime();
  return diffInMs / (1000 * 60 * 60 * 24);
}

function addValueToMap(map, key, value) {
  map[key] = map[key] || [];
  if (value !== null) map[key].push(value);
}

function isUserInArray(array, userId) {
  return array.some((entry) => entry.userId === userId);
}

function dateIsNotTheMostRecent(array, userId, date) {
  const stat = array.find((entry) => entry.userId === userId);
  return date > stat.date;
}

function updateDateToTheMostRecent(
  recentUsersLogins: RecentUserEntry[],
  userId: number,
  date: Date,
) {
  for (let i = 0; i < recentUsersLogins.length; i++) {
    if (recentUsersLogins[i].userId === userId) {
      recentUsersLogins[i].date = date;
    }
  }
}

function getCategory(diffInDays) {
  if (diffInDays < 1) return categories.daily;
  else if (diffInDays >= 1 && diffInDays <= 7) return categories.weekly;
  else if (diffInDays > 7 && diffInDays <= 30) return categories.monthly;
  else return categories.anualy;
}

function convertDatesToCategory(recentUsersLogins: RecentUserEntry[]) {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  for (const loginEntry of recentUsersLogins) {
    const diffInDays = dateDiffInDays(today, loginEntry.date);
    loginEntry.category = getCategory(diffInDays);
  }

  const dailyCategory: UsersByCategory = {
    category: categories.daily,
    amountOfUsers: 0,
  };
  const weeklyCategory: UsersByCategory = {
    category: categories.weekly,
    amountOfUsers: 0,
  };
  const monthlyCategory: UsersByCategory = {
    category: categories.monthly,
    amountOfUsers: 0,
  };
  const anualCategory: UsersByCategory = {
    category: categories.anualy,
    amountOfUsers: 0,
  };

  const usersByCategories: UsersByCategory[] = [
    dailyCategory,
    weeklyCategory,
    monthlyCategory,
    anualCategory,
  ];

  for (const recentUserLogin of recentUsersLogins) {
    for (const userByCategory of usersByCategories) {
      if (userByCategory.category === recentUserLogin.category) {
        userByCategory.amountOfUsers++;
      }
    }
  }

  return usersByCategories;
}

function getSevenDaysBackFromDate(date) {
  const result = new Date(date);
  result.setDate(result.getDate() - 7);
  return result;
}

function getDates(from, to) {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  from = new Date(new Date(from).setHours(0, 0, 0, 0));
  to = new Date(new Date(to).setHours(0, 0, 0, 0));

  if (!from && !to) {
    to = today;
    from = getSevenDaysBackFromDate(today);
  }

  return { from, to };
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(ExamStat)
    private examStatsRepository: Repository<ExamStat>,
    @InjectRepository(UnitStat)
    private unitStatsRepository: Repository<UnitStat>,
    @InjectRepository(UserStat)
    private userStatsRepository: Repository<UserStat>,
  ) {}

  async findAll(): Promise<UserStat[]> {
    return await this.userStatsRepository.find();
  }

  async createExamStat(createExamStatDto: CreateExamStatDto) {
    return await this.examStatsRepository.save(new ExamStat(createExamStatDto));
  }

  //Creates new entry if user didn't was not active today.
  //If he was, it adds up to the amount of exercises
  async createUserStat(createUserStatDto: CreateUserStatDto, date: Date) {
    if (!date) {
      date = new Date(new Date().setHours(0, 0, 0, 0));
    }
    const userDataFromToday = await this.userStatsRepository.findOne({
      where: {
        createdDate: date,
        userId: createUserStatDto.userId,
      },
    });
    if (!userDataFromToday) {
      return await this.userStatsRepository.save(
        new UserStat(createUserStatDto, date),
      );
    } else {
      await this.userStatsRepository.update(userDataFromToday.id, {
        exercisesDone:
          userDataFromToday.exercisesDone + createUserStatDto.exercisesDone,
      });
      return this.userStatsRepository.findOne(userDataFromToday.id);
    }
  }

  //TODO: remove
  async remove(id: number) {
    return await this.userStatsRepository.delete(id);
  }

  async increasePassedUnits() {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const todayStat = await this.unitStatsRepository.findOne({
      where: { date: today },
    });
    if (!todayStat) {
      return await this.unitStatsRepository.save({
        date: today,
        dailyPassedUnits: 1,
      });
    } else {
      todayStat.dailyPassedUnits += 1;
      return await this.unitStatsRepository.save(todayStat);
    }
  }

  async getMeanTimeForExams(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    const examStats = await this.examStatsRepository.find(dateQuery);
    const sum = examStats.map((e) => e.examTime).reduce((a, b) => a + b, 0);
    if (examStats.length === 0) {
      return 0;
    }
    return Math.round(sum / examStats.length);
  }

  async getDailyActiveUsers(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    const activeUsersByDate = new Map<Date, Array<UserStat>>();
    const allStats = await this.userStatsRepository.find(dateQuery);
    const dates: any = getDates(params.from, params.to);

    //Adding the empty ones
    for (let i = 0; i < dateDiffInDays(dates.to, dates.from); i++) {
      const newDate = addDays(dates.from, i);
      addValueToMap(activeUsersByDate, newDate, null);
    }

    //Adding the ones that have users
    for (const stat of allStats) {
      if (stat.exercisesDone > 0)
        addValueToMap(activeUsersByDate, stat.date, stat);
    }

    const listOfActiveUsers: ActiveUserEntry[] = [];

    for (const dateKey in activeUsersByDate) {
      const actualValues = activeUsersByDate[dateKey];
      console.log(actualValues);
      const entry: ActiveUserEntry = {
        date: new Date(dateKey),
        amountOfUsers: actualValues.length,
      };
      listOfActiveUsers.push(entry);
    }

    return listOfActiveUsers;
  }

  async getAccessFrecuency() {
    const allStats = await this.userStatsRepository.find();
    console.log(allStats);
    const recentUsersLogins: RecentUserEntry[] = [];

    for (const stat of allStats) {
      //agregar si no está
      if (!isUserInArray(recentUsersLogins, stat.userId)) {
        const newEntry: RecentUserEntry = {
          userId: stat.userId,
          date: stat.date,
          category: ' ',
        };
        recentUsersLogins.push(newEntry);
      } else if (
        isUserInArray(recentUsersLogins, stat.userId) &&
        dateIsNotTheMostRecent(recentUsersLogins, stat.userId, stat.date)
      ) {
        updateDateToTheMostRecent(recentUsersLogins, stat.userId, stat.date);
      }
    }

    const usersByCategories = convertDatesToCategory(recentUsersLogins);
    return usersByCategories;
  }

  async getDailyCompletedUnits(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    return (await this.unitStatsRepository.find(dateQuery)).map((u) => ({
      date: u.date,
      dailyPassedUnits: u.dailyPassedUnits,
    }));
  }

  private buildQuery(params: StatsParams) {
    let dateQuery: FindOperator<Date>;
    if (params.from && params.to) {
      const diff = Math.floor(
        (new Date(params.to).getTime() - new Date(params.from).getTime()) /
          86400000,
      );
      if (diff > MAX_DAYS_DIFF) {
        const maxTimeBefore = new Date(params.to);
        maxTimeBefore.setDate(maxTimeBefore.getDate() - MAX_DAYS_DIFF);
        params.from = maxTimeBefore;
      }
      dateQuery = Between(params.from, params.to);
    } else {
      if (params.from) {
        dateQuery = MoreThan(params.from);
      }
      if (params.to) {
        //If "from" not provided, get a week before "to"
        const weekBefore = new Date(params.to);
        weekBefore.setDate(weekBefore.getDate() - 7);
        params.from = weekBefore;
        dateQuery = Between(params.from, params.to);
      }
    }

    if (!dateQuery) return {};
    return { where: { date: dateQuery } };
  }
}
