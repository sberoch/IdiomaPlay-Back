import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { CreateExamnDto } from './dto/create-examn.dto';
import { UpdateExamnDto } from './dto/update-examn.dto';
import { Examn } from './entities/examn.entity';
import { ExamnParams } from "./dto/examn.params";
import { buildQuery } from "./examns.query-builder";

@Injectable()
export class ExamnsService {
  constructor(
    @InjectRepository(Examn)
    private examnsRepository: Repository<Examn>,
    private exerciseService: ExercisesService,
  ) {}

  async create(createExamnDto: CreateExamnDto) {
    const { exercisesIds, ...rest } = createExamnDto;
    const exercises: Exercise[] = [];
    for (const exerciseId of exercisesIds) {
      const exercise: Exercise = await this.exerciseService.findOne(exerciseId);
      exercises.push(exercise);
    }
    return this.examnsRepository.save(new Examn({ exercises, ...rest }));
  }

  findAll(params: ExamnParams): Promise<Pagination<Examn>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<Examn>(this.examnsRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number) {
    const lesson = await this.examnsRepository.findOne(id);
    if (!lesson) throw new BadRequestException('No se encontro el examen');
    return lesson;
  }

  update(id: number, updateLessonDto: UpdateExamnDto) {
    return this.examnsRepository.update(id, updateLessonDto);
  }

  async remove(id: number): Promise<void> {
    await this.examnsRepository.delete(id);
  }
}
