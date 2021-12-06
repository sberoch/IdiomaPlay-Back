import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOperator, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateExamStatDto } from './dto/create-stat.dto';
import { StatsParams } from './dto/stats.params';
import { ExamStat } from './entities/exam-stat.entity';
import { UnitStat } from './entities/unit-stat.entity';
import { UserStat } from './entities/user-stat.entity';
import { CreateUserStatDto } from './dto/create-user-stat.dto';

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

function addValueToMap(map, key, value) {
  map[key] = map[key] || [];
  map[key].push(value);
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
  for (const login of recentUsersLogins) {
    const diffInMs = today.getTime() - login.date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    login.category = getCategory(diffInDays);
  }
}

// function addDays(date, days) {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

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

  async createExamStat(createExamStatDto: CreateExamStatDto) {
    return await this.examStatsRepository.save(new ExamStat(createExamStatDto));
  }

  //Creates new entry if user didn't was not active today. If he was, it adds up to the amount of exercises
  async createUserStat(createUserStatDto: CreateUserStatDto) {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const userDataFromToday = await this.userStatsRepository.findOne({
      where: {
        createdDate: today,
        userId: createUserStatDto.userId,
      },
    });
    if (!userDataFromToday)
      return await this.userStatsRepository.save(
        new UserStat(createUserStatDto),
      );
    else {
      return await this.userStatsRepository.update(userDataFromToday.id, {
        exercisesDone:
          userDataFromToday.exercisesDone + createUserStatDto.exercisesDone,
      });
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

    for (const stat of allStats) {
      if (stat.exercisesDone > 0)
        addValueToMap(activeUsersByDate, stat.createdDate, stat);
    }

    const listOfActiveUsers: ActiveUserEntry[] = [];

    for (const dateKey in activeUsersByDate) {
      const actualValues = activeUsersByDate[dateKey];
      const entry: ActiveUserEntry = {
        date: actualValues[0].createdDate,
        amountOfUsers: actualValues.length,
      };
      listOfActiveUsers.push(entry);
    }
    return listOfActiveUsers;
  }

  async getAccessFrecuency(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    const allStats = await this.userStatsRepository.find(dateQuery);
    console.log(allStats);
    const recentUsersLogins: RecentUserEntry[] = [];

    for (const stat of allStats) {
      //agregar si no está
      if (!isUserInArray(recentUsersLogins, stat.userId)) {
        const newEntry: RecentUserEntry = {
          userId: stat.userId,
          date: stat.createdDate,
          category: ' ',
        };
        recentUsersLogins.push(newEntry);
      } else if (
        isUserInArray(recentUsersLogins, stat.userId) &&
        dateIsNotTheMostRecent(recentUsersLogins, stat.userId, stat.createdDate)
      ) {
        updateDateToTheMostRecent(
          recentUsersLogins,
          stat.userId,
          stat.createdDate,
        );
      }
    }

    convertDatesToCategory(recentUsersLogins);
    return recentUsersLogins;
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
    if (params.from) {
      dateQuery = MoreThan(params.from);
    }
    if (params.to) {
      dateQuery = LessThan(params.to);
    }
    if (params.from && params.to) {
      dateQuery = Between(params.from, params.to);
    }
    if (!dateQuery) return {};
    return { where: { createdDate: dateQuery } };
  }
}
