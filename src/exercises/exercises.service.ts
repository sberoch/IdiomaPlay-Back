import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Exercise } from "./entities/exercise.entity";
import { ExerciseParams } from "./dto/exercise.params";
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { buildQuery } from "./exercises.query-builder";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}
  
  create(createExerciseDto: CreateExerciseDto) {
    return this.exercisesRepository.save(new Exercise(createExerciseDto));
  }

  findAll(params: ExerciseParams): Promise<Pagination<Exercise>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<Exercise>(this.exercisesRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  findOne(id: number) {
    return this.exercisesRepository.findOne(id);
  }

  update(id: number, updateExerciseDto: UpdateExerciseDto): Promise<UpdateResult> {
    return this.exercisesRepository.update(id, updateExerciseDto);
  }

  async remove(id: number): Promise<void> {
    await this.exercisesRepository.delete(id);
  }
}
