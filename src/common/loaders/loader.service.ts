import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ExercisesService } from '../../exercises/exercises.service';
import * as exercisesJson from '../../../exercises.json';
import { CreateExerciseDto } from '../../exercises/dto/create-exercise.dto';
import {
  Exercise,
  ExerciseType,
} from '../../exercises/entities/exercise.entity';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LessonsService } from '../../lessons/lessons.service';
import { ExamsService } from '../../exams/exams.service';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { User } from '../../users/entities/user.entity';
import { Unit } from '../../units/entities/unit.entity';

@Injectable()
export class LoaderService implements OnApplicationBootstrap {
  constructor(
    private exercisesService: ExercisesService,
    private usersService: UsersService,
    private lessonsService: LessonsService,
    private examsService: ExamsService,
  ) {}

  async onApplicationBootstrap() {
    const exercises = await this.loadExercises();
    console.log(`Loaded ${exercises.length} exercises`);

    const user = await this.loadTestUser();
    console.log(`Loaded test user: ${user.email}`);
  }

  async loadExercises(): Promise<Exercise[]> {
    const prevExercises = await this.exercisesService.findAll({ limit: 1000 });
    if (prevExercises && prevExercises.meta.totalItems !== 0) {
      return prevExercises.items;
    }
    const exercises: Exercise[] = [];
    for (const exercise of exercisesJson) {
      const { type, ...rest } = exercise;
      const typeAux: ExerciseType = type as ExerciseType;
      const dto: CreateExerciseDto = { type: typeAux, ...rest };
      const created = await this.exercisesService.create(dto);
      exercises.push(created);
    }
    return exercises;
  }

  //TODO: completar estos tres metodos con un json
  async loadUnits(): Promise<Unit[]> {
    const units: Unit[] = [];
    return units;
  }
  async loadLessons(): Promise<Lesson[]> {
    const lessons: Lesson[] = [];
    return lessons;
  }

  async loadExams(): Promise<Exam[]> {
    const exams: Exam[] = [];
    return exams;
  }

  //TODO: Sacar esto cuando se haga el login con google
  async loadTestUser(): Promise<User> {
    const prev = await this.usersService.findAll({});
    if (prev && prev.meta.totalItems !== 0) {
      return prev.items[0];
    }
    const dto: CreateUserDto = { email: 'test@test.com' };
    const user = await this.usersService.create(dto);
    return user;
  }
}
