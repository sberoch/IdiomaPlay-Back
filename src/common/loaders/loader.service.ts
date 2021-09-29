import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ExercisesService } from '../../exercises/exercises.service';
import * as exercisesJson from '../../../exercises.json';
import { CreateExerciseDto } from '../../exercises/dto/create-exercise.dto';
import { ExerciseType } from '../../exercises/entities/exercise.entity';

async function loadExercises(exercisesService: ExercisesService) {
  exercisesService.removeAll();
  for (const exercise of exercisesJson) {
    const { type, ...rest } = exercise;
    const typeAux: ExerciseType = type as ExerciseType;
    const dto: CreateExerciseDto = { type: typeAux, ...rest };
    await exercisesService.create(dto);
  }
}

@Injectable()
export class LoaderService implements OnApplicationBootstrap {
  constructor(private exercisesService: ExercisesService) {}

  async onApplicationBootstrap() {
    loadExercises(this.exercisesService);
  }
}
