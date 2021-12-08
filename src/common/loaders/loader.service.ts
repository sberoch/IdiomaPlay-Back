import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ChallengesService } from '../../challenges/challenges.service';
import { CreateChallengeDto } from '../../challenges/dto/create-challenge.dto';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { ExamsService } from '../../exams/exams.service';
import { ExercisesService } from '../../exercises/exercises.service';
import { LessonsService } from '../../lessons/lessons.service';
import { CreateUserStatDto } from '../../stats/dto/create-user-stat.dto';
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

  async loadUserStats(): Promise<UserStat[]> {
    const prevStats = await this.statsService.findAll();
    if (prevStats && prevStats.length !== 0) {
      return prevStats;
    }
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const userStatsCreated: UserStat[] = [];

    for (let i = 0; i < 7; i++) {
      const dto: CreateUserStatDto = {
        userId: 800 + i,
        exercisesDone: 1,
      };
      const createdStat = await this.statsService.createUserStat(
        dto,
        getDaysBackFromDate(today, i),
      );
      userStatsCreated.push(createdStat);

      if (i % 2 === 0) {
        const anotherDto: CreateUserStatDto = {
          userId: 900 + i,
          exercisesDone: 1,
        };
        const anotherCreated = await this.statsService.createUserStat(
          anotherDto,
          getDaysBackFromDate(today, i),
        );
        userStatsCreated.push(anotherCreated);
      }
    }
    return userStatsCreated;
  }
}
