import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Challenge } from '../challenges/entities/challenge.entity';
import { config } from '../common/config';
import { Exam } from '../exams/entities/exam.entity';
import { ExamsService } from '../exams/exams.service';
import { CreateExerciseDto } from '../exercises/dto/create-exercise.dto';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsService } from '../lessons/lessons.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitParams } from './dto/unit.params';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from './entities/unit.entity';
import { buildQuery } from './units.query-builder';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
    private lessonsService: LessonsService,
    private examsService: ExamsService,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    const { lessons, ...rest } = createUnitDto;
    const createdLessons: Lesson[] = [];
    let exercises: CreateExerciseDto[] = [];
    const unit = new Unit({ ...rest });
    for (const lesson of lessons) {
      const createdLesson = await this.lessonsService.create(lesson);
      createdLessons.push(createdLesson);
      exercises = exercises.concat(lesson.exercises);
    }
    unit.lessons = createdLessons;
    unit.exam = new Exam({
      title: `Exam - ${rest.title}`,
      exercises: exercises.map((e) => new Exercise(e)),
      examTimeInSeconds: config.examTimeInSeconds,
    });
    return unit;
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

  async upsert(challenge: Challenge, dto: CreateUnitDto) {
    const unit = await this.unitsRepository.findOne(
      { title: dto.title, challenge },
      { relations: ['challenge'] },
    );
    if (!unit) {
      return await this.create(dto);
    } else {
      const upsertedLessons: Lesson[] = [];
      for (const lesson of dto.lessons) {
        const updated = await this.lessonsService.upsert(unit, lesson);
        upsertedLessons.push(updated);
      }
      unit.lessons = upsertedLessons;
      Object.assign(unit, dto);
      return unit;
    }
  }

  async update(id: number, updateUnitDto: UpdateUnitDto) {
    const unit = await this.unitsRepository.findOne(id);
    const upsertedLessons: Lesson[] = [];
    for (const lesson of updateUnitDto.lessons) {
      const updated = await this.lessonsService.upsert(unit, lesson);
      upsertedLessons.push(updated);
    }
    unit.lessons = upsertedLessons;
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
