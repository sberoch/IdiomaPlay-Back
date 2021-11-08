import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ExamsService } from '../exams/exams.service';
import { LessonsService } from '../lessons/lessons.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Unit } from './entities/unit.entity';
import { UnitParams } from './dto/unit.params';
import { buildQuery } from './units.query-builder';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Exam } from '../exams/entities/exam.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
    private lessonsService: LessonsService,
    private examsService: ExamsService,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    const { lessonsIds, examId, ...rest } = createUnitDto;
    const lessons: Lesson[] = [];
    const unit = new Unit({ ...rest });
    for (const lessonId of lessonsIds) {
      const lesson: Lesson = await this.lessonsService.findOne(lessonId);
      delete lesson.unit;
      lessons.push(lesson);
    }
    let exam: Exam;
    if (examId) {
      exam = await this.examsService.findOne(examId);
      unit.lessons = lessons;
      unit.exam = exam;
    } else {
      const exercisesIds = await this.lessonsService.findExercisesIds(
        lessonsIds.map((l) => +l),
      );
      exam = await this.examsService.create({
        title: `Exam: ${unit.title}`,
        exercisesIds,
      });
      delete exam.exercises;
      unit.exam = exam;
      unit.lessons = lessons;
    }
    return this.unitsRepository.save(unit);
  }

  findAll(params: UnitParams): Promise<Pagination<Unit>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<Unit>(this.unitsRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number) {
    const unit = await this.unitsRepository.findOne(id);
    if (!unit) throw new BadRequestException('No se encontro la leccion');
    return unit;
  }

  findOneWithLessonsAndExam(id: number) {
    return this.unitsRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id: id })
      .leftJoinAndSelect('u.lessons', 'lessons')
      .leftJoinAndSelect('u.exam', 'exams')
      .getOne();
  }

  async findOneWithExamTriedInUnit(unitId: number, userId: number) {
    return this.unitsRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { unitId })
      .leftJoinAndSelect('u.lessons', 'lessons')
      .leftJoinAndSelect('u.exam', 'exams')
      .leftJoinAndSelect('u.participations', 'participations')
      .where('participations.user.id = :userId', { userId })
      .andWhere('participations.exam.id = u.exam')
      .andWhere('participations.unit.id = :unitId', { unitId })
      .getOne();
  }

  async isUnitPassedByUser(unitId: number, userId: number): Promise<boolean> {
    const unit = await this.findOneWithExamTriedInUnit(unitId, userId);

    // If participations for unit exam where found for "userId"
    if (unit) {
      for (const examParticipation of unit.participations) {
        if (examParticipation.isPassed) {
          return true;
        }
      }
    }
    return false;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto) {
    if (updateUnitDto.lessons) {
      delete updateUnitDto.lessons;
    }
    if (updateUnitDto.exam) {
      delete updateUnitDto.exam;
    }
    const unit = await this.unitsRepository.findOne(id);
    Object.assign(unit, updateUnitDto);
    return this.unitsRepository.save(unit);
  }

  async remove(id: number) {
    const removed = await this.unitsRepository.findOne(id);
    await this.unitsRepository.delete(id);
    return removed;
  }

  async removeAll(): Promise<void> {
    const units = await this.unitsRepository.find();
    await this.unitsRepository.remove(units);
  }
}
