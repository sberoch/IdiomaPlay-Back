import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ChallengesService } from '../../challenges/challenges.service';
import { CreateChallengeDto } from '../../challenges/dto/create-challenge.dto';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { ExamsService } from '../../exams/exams.service';
import { ExercisesService } from '../../exercises/exercises.service';
import { LessonsService } from '../../lessons/lessons.service';
import { UnitsService } from '../../units/units.service';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import * as challengesJson from '../jsons/challenges.json';

@Injectable()
export class LoaderService implements OnApplicationBootstrap {
  constructor(
    private exercisesService: ExercisesService,
    private usersService: UsersService,
    private lessonsService: LessonsService,
    private examsService: ExamsService,
    private unitsService: UnitsService,
    private challengesService: ChallengesService,
  ) {}

  async onApplicationBootstrap() {
    const challenges = await this.loadChallenges();
    console.log(`Loaded ${challenges.length} challenges`);

    const admin = await this.loadAdminUser();
    console.log(`Loaded ${admin.email} as admin`);
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
}
