import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonParams } from './dto/lesson.params';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { buildQuery } from './lessons.query-builder';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    private exerciseService: ExercisesService,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const { exercisesIds, ...rest } = createLessonDto;
    const exercises: Exercise[] = [];
    const lesson = new Lesson({ ...rest });
    for (const exerciseId of exercisesIds) {
      const exercise: Exercise = await this.exerciseService.findOne(exerciseId);
      exercises.push(exercise);
    }
    lesson.exercises = exercises;
    return this.lessonsRepository.save(lesson);
  }

  findAll(params: LessonParams): Promise<Pagination<Lesson>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<Lesson>(this.lessonsRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number) {
    const lesson = await this.lessonsRepository.findOne(id);
    if (!lesson) throw new BadRequestException('No se encontro la leccion');
    return lesson;
  }

  findOneWithExercises(id: number) {
    return this.lessonsRepository
      .createQueryBuilder('l')
      .where('l.id = :id', { id: id })
      .leftJoinAndSelect('l.exercises', 'exercises')
      .getOne();
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return this.lessonsRepository.update(id, updateLessonDto);
  }

  async remove(id: number): Promise<void> {
    await this.lessonsRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    const lessons = await this.lessonsRepository.find();
    await this.lessonsRepository.remove(lessons);
  }
}
