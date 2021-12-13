import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ChallengesService } from '../../challenges/challenges.service';
import { CreateChallengeDto } from '../../challenges/dto/create-challenge.dto';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { ExamsService } from '../../exams/exams.service';
import { ExercisesService } from '../../exercises/exercises.service';
import { LessonsService } from '../../lessons/lessons.service';
import { CreateExamStatDto } from '../../stats/dto/create-stat.dto';
import { CreateUnitStatDto } from '../../stats/dto/create-unit-stat.dto';
import { CreateUserStatDto } from '../../stats/dto/create-user-stat.dto';
import { ExamStat } from '../../stats/entities/exam-stat.entity';
import { UnitStat } from '../../stats/entities/unit-stat.entity';
import { UserStat } from '../../stats/entities/user-stat.entity';
import { StatsService } from '../../stats/stats.service';
import { UnitsService } from '../../units/units.service';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import * as challengesJson from '../jsons/challenges.json';

function getDaysBackFromDate(date, amountOfDays) {
  const result = new Date(date);
  result.setDate(result.getDate() - amountOfDays);
  return result;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

@Injectable()
export class LoaderService implements OnApplicationBootstrap {
  constructor(
    private exercisesService: ExercisesService,
    private usersService: UsersService,
    private lessonsService: LessonsService,
    private examsService: ExamsService,
    private unitsService: UnitsService,
    private challengesService: ChallengesService,
    private statsService: StatsService,
  ) {}

  async onApplicationBootstrap() {
    const challenges = await this.loadChallenges();
    console.log(`Loaded ${challenges.length} challenges`);

    const admin = await this.loadAdminUser();
    console.log(`Loaded ${admin.email} as admin`);

    const userStats = await this.loadUserStats();
    console.log(`Loaded ${userStats.length} user stats`);

    const unitStats = await this.loadUnitStats();
    console.log(`Loaded ${unitStats.length} unit stats`);

    const examStats = await this.loadExamStats();
    console.log(`Loaded ${examStats.length} exam stats`);
  }

  async loadChallenges(): Promise<Challenge[]> {
    const prevChallenges = await this.challengesService.findAll({
      limit: 1000,
    });
    if (prevChallenges && prevChallenges.meta.totalItems !== 0) {
      return prevChallenges.items;
    }

    const challenges: Challenge[] = [];
    for (const challenge of challengesJson) {
      const dto: CreateChallengeDto = challenge as CreateChallengeDto;
      const created = await this.challengesService.create(dto);
      challenges.push(created);
    }
    return challenges;
  }

  async loadAdminUser(): Promise<User> {
    const prevUsers = await this.usersService.findAll({
      limit: 1000,
    });
    if (prevUsers && prevUsers.meta.totalItems !== 0) {
      return prevUsers.items[0];
    }
    const user = await this.usersService.createAdmin(
      'admin@admin.com',
      'idiomaplayadmin',
    );
    await this.usersService.createTestUser('sberoch@fi.uba.ar', 'asd');
    await this.usersService.createTestUser('airibarren@fi.uba.ar', 'asd');
    await this.usersService.createTestUser('sberoch@gmail.com', 'asd');
    return user;
  }

  async loadUnitStats(): Promise<UnitStat[]> {
    const prevStats = await this.statsService.findAllUnitStats();
    if (prevStats && prevStats.length !== 0) {
      return prevStats;
    }
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const unitStatsCreated: UnitStat[] = [];
    for (let i = 0; i < 100; i++) {
      const num = getRandomInt(100);
      const dto: CreateUnitStatDto = {
        dailyPassedUnits: num,
      };
      const createdStat = await this.statsService.createUnitStat(
        dto,
        getDaysBackFromDate(today, i),
      );
      unitStatsCreated.push(createdStat);
    }
    return unitStatsCreated;
  }

  async loadExamStats(): Promise<ExamStat[]> {
    const prevStats = await this.statsService.findAllExamStats();
    if (prevStats && prevStats.length !== 0) {
      return prevStats;
    }
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const unitStatsCreated: ExamStat[] = [];
    for (let i = 0; i < 105; i++) {
      const num = getRandomInt(100);
      const dto: CreateExamStatDto = {
        date: getDaysBackFromDate(today, num),
        examTime: 100 + num,
        passed: num > 30,
      };
      const createdStat = await this.statsService.createExamStat(dto);
      unitStatsCreated.push(createdStat);
    }
    for (let i = 0; i < 7; i++) {
      const dto: CreateExamStatDto = {
        date: getDaysBackFromDate(today, i),
        examTime: 100 + 10 * i,
        passed: i % 2 === 0,
      };
      const createdStat = await this.statsService.createExamStat(dto);
      unitStatsCreated.push(createdStat);
    }
    return unitStatsCreated;
  }

  async loadUserStats(): Promise<UserStat[]> {
    const prevStats = await this.statsService.findAllUserStats();
    if (prevStats && prevStats.length !== 0) {
      return prevStats;
    }
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const userStatsCreated: UserStat[] = [];

    for (let i = 0; i < 300; i++) {
      const num = getRandomInt(100);
      const dto: CreateUserStatDto = {
        userId: 800 + i,
        exercisesDone: 1,
      };
      const createdStat = await this.statsService.createUserStat(
        dto,
        getDaysBackFromDate(today, num),
      );
      userStatsCreated.push(createdStat);
    }
    return userStatsCreated;
  }
}
