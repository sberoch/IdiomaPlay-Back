import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
import { ExamParams } from './dto/exam.params';
import { buildQuery } from './exams.query-builder';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    private exerciseService: ExercisesService,
  ) {}

  async create(createExamDto: CreateExamDto) {
    const { exercisesIds, ...rest } = createExamDto;
    const exercises: Exercise[] = [];
    for (const exerciseId of exercisesIds) {
      const exercise: Exercise = await this.exerciseService.findOne(exerciseId);
      exercises.push(exercise);
    }
    return this.examsRepository.save(new Exam({ exercises, ...rest }));
  }

  findAll(params: ExamParams): Promise<Pagination<Exam>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<Exam>(this.examsRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number) {
    const exam = await this.examsRepository.findOne(id);
    if (!exam) throw new BadRequestException('No se encontro el examen');
    return exam;
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    return this.examsRepository.update(id, updateExamDto);
  }

  async remove(id: number): Promise<void> {
    await this.examsRepository.delete(id);
  }
}
