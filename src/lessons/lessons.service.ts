import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { Unit } from '../units/entities/unit.entity';
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
    const { exercises, ...rest } = createLessonDto;
    const createdExercises: Exercise[] = [];
    const lesson = new Lesson({ ...rest });
    for (const exercise of exercises) {
      const createdExercise = new Exercise(exercise);
      createdExercises.push(createdExercise);
    }
    lesson.exercises = createdExercises;
    return lesson;
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

  async findExercisesIds(lessonsIds: number[]) {
    const lessons = await this.lessonsRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.exercises', 'exercises')
      .where('l.id IN (:...ids)', { ids: lessonsIds })
      .getMany();
    const exercisesIds: number[] = [];
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        const id = exercise.id;
        if (!exercisesIds.includes(id)) {
          exercisesIds.push(id);
        }
      }
    }
    return exercisesIds;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonsRepository.findOne(id);
    const updatedExercises: Exercise[] = [];
    for (const exercise of updateLessonDto.exercises) {
      const updated = await this.exerciseService.upsert(exercise);
      updatedExercises.push(updated);
    }
    lesson.exercises = updatedExercises;
    Object.assign(lesson, updateLessonDto);
    return this.lessonsRepository.save(lesson);
  }

  async upsert(unit: Unit, dto: CreateLessonDto) {
    const lesson = await this.lessonsRepository.findOne(
      { title: dto.title, unit },
      { relations: ['unit'] },
    );
    if (!lesson) {
      return await this.create(dto);
    } else {
      const updatedExercises: Exercise[] = [];
      for (const exercise of dto.exercises) {
        const updated = await this.exerciseService.upsert(exercise);
        updatedExercises.push(updated);
      }
      lesson.exercises = updatedExercises;
      Object.assign(lesson, dto);
      return lesson;
    }
  }

  async remove(id: number) {
    const removed = await this.lessonsRepository.findOne(id);
    await this.lessonsRepository.delete(id);
    return removed;
  }

  async removeAll(): Promise<void> {
    const lessons = await this.lessonsRepository.find();
    await this.lessonsRepository.remove(lessons);
  }
}
