import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseParams } from './dto/exercise.params';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { buildQuery } from './exercises.query-builder';

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

  async upsert(dto: CreateExerciseDto) {
    const exercise = await this.exercisesRepository.findOne({
      title: dto.title,
      sentence: dto.sentence,
    });
    if (!exercise) {
      return await this.create(dto);
    } else {
      Object.assign(exercise, dto);
      return exercise;
    }
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
