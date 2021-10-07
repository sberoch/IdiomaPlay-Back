import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ExercisesService } from '../../exercises/exercises.service';
import * as exercisesJson from '../jsons/exercises.json';
import * as lessonsJson from '../jsons/lessons.json';
import * as examsJson from '../jsons/exams.json';
import * as unitsJson from '../jsons/units.json';
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
import { CreateLessonDto } from '../../lessons/dto/create-lesson.dto';
import { config } from "../config";
import { CreateExamDto } from '../../exams/dto/create-exam.dto';
import { UnitsService } from '../../units/units.service';
import { CreateUnitDto } from '../../units/dto/create-unit.dto';

function getRandomExercisesForExam(exercises){
  //Shuffles the array
  const shuffled = exercises.sort(() => 0.5 - Math.random());
  //Selects the first 16 elements
  return shuffled.slice(0, config.amountOfExercisesPerExam);
}

@Injectable()
export class LoaderService implements OnApplicationBootstrap {
  constructor(
    private exercisesService: ExercisesService,
    private usersService: UsersService,
    private lessonsService: LessonsService,
    private examsService: ExamsService,
    private unitsService: UnitsService
  ) {}

  async onApplicationBootstrap() {
    const exercises = await this.loadExercises();
    console.log(`Loaded ${exercises.length} exercises`);

    const lessons = await this.loadLessons();
    console.log(`Loaded ${lessons.length} lessons`);

    const exams = await this.loadExams();
    console.log(`Loaded ${exams.length} exams`)

    const units = await this.loadUnits();
    console.log(`Loaded ${units.length} units`)
    
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

  async loadUnits(): Promise<Unit[]> {
    const prevUnits = await this.unitsService.findAll({ limit: 1000 });
    if (prevUnits && prevUnits.meta.totalItems !== 0) {
      return prevUnits.items;
    }

    const units: Unit[] = [];
    for (const unit of unitsJson) {
      const dto: CreateUnitDto = unit as CreateUnitDto;
      const created = await this.unitsService.create(dto);
      units.push(created)
    }
    return units;
  }

  async loadLessons(): Promise<Lesson[]> {
    const prevLessons = await this.lessonsService.findAll({ limit: 1000 });
    if (prevLessons && prevLessons.meta.totalItems !== 0) {
      return prevLessons.items;
    }

    const lessons: Lesson[] = [];
    for (const lesson of lessonsJson) {
      const dto: CreateLessonDto = lesson as CreateLessonDto;
      const created = await this.lessonsService.create(dto);
      lessons.push(created);
    }
    return lessons;
  }

  async loadExams(): Promise<Exam[]> {
    const prevExams = await this.examsService.findAll({ limit: 1000 });
    if (prevExams && prevExams.meta.totalItems !== 0) {
      return prevExams.items;
    }

    const exams: Exam[] = [];
    for (const exam of examsJson) {
      const { exercisesFromLessonsIds, ...rest} = exam;
      const exercisesIds = getRandomExercisesForExam(exercisesFromLessonsIds)
      const dto: CreateExamDto = {exercisesIds, ...rest}
      const created = await this.examsService.create(dto)
      exams.push(created)
    }
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
