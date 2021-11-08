import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { ExerciseParams } from './dto/exercise.params';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { buildQuery } from './exercises.query-builder';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

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

  async findOne(id: number) {
    const exercise = await this.exercisesRepository.findOne(id);
    if (!exercise) throw new BadRequestException('No se encontro el ejercicio');
    return exercise;
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    const exercise = await this.exercisesRepository.findOne(id);
    Object.assign(exercise, updateExerciseDto);
    return this.exercisesRepository.save(exercise);
  }

  async remove(id: number) {
    const removed = await this.exercisesRepository.findOne(id);
    await this.exercisesRepository.delete(id);
    return removed;
  }

  async removeAll(): Promise<void> {
    const exercises = await this.exercisesRepository.find();
    await this.exercisesRepository.remove(exercises);
  }
}
