import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Exam } from '../exams/entities/exam.entity';
import { ExamsService } from '../exams/exams.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsService } from '../lessons/lessons.service';
import { UnitsService } from '../units/units.service';
import { UsersService } from '../users/users.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { ParticipationParams } from './dto/participation.params';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { Participation } from './entities/participation.entity';
import { buildQuery } from './participations.query-builder';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private participationsRepository: Repository<Participation>,
    private usersService: UsersService,
    private lessonsService: LessonsService,
    private examsService: ExamsService,
    private unitsService: UnitsService,
  ) {}

  async create(createParticipationDto: CreateParticipationDto) {
    const { userId, examId, lessonId, unitId, ...rest } =
      createParticipationDto;
    if (!(examId || lessonId))
      throw new BadRequestException('Se debe proveer una leccion o un examen');
    if (examId && lessonId)
      throw new BadRequestException(
        'Se debe proveer una leccion o un examen. No ambas',
      );
    const user = await this.usersService.findOne(userId);
    const unit = await this.unitsService.findOne(unitId);
    let totalExercises = 0;
    let lesson: Lesson;
    if (lessonId) {
      lesson = await this.lessonsService.findOneWithExercises(lessonId);
      totalExercises = lesson.exercises.length;
    }
    let exam: Exam;
    if (examId) {
      exam = await this.examsService.findOneWithExercises(examId);
      totalExercises = exam.exercises.length;
    }
    return this.participationsRepository.save(
      new Participation({ user, lesson, exam, totalExercises, unit, ...rest }),
    );
  }

  /**
   *
   * @param params params for query. user and unit are required.
   * @returns array of the following shape [{ lessonId: number, passed: boolean }]
   */
  async findPassedLessons(params: ParticipationParams) {
    if (!(params.unit && params.user))
      throw new BadRequestException('Se debe proveer una unidad y un usuario');
    const participations = await this.findUnitParticipationsForUser(
      params.unit,
      params.user,
    );
    const latest: Participation[] = [];
    for (const asd of participations) {
      const elemInLatest = latest.find((it) => it.lesson.id === asd.lesson.id);
      if (elemInLatest) {
        latest[latest.findIndex((it) => it === elemInLatest)] =
          asd.createdAt > elemInLatest.createdAt ? asd : elemInLatest;
      } else {
        latest.push(asd);
      }
    }
    return latest.map((it) => ({
      lessonId: it.lesson.id,
      passed: it.isPassed,
    }));
  }

  private async findUnitParticipationsForUser(unitId: number, userId: number) {
    return this.participationsRepository
      .createQueryBuilder('p')
      .leftJoin('p.unit', 'unit')
      .where('unit.id = :unitId', { unitId })
      .leftJoin('p.user', 'user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('p.lesson', 'lesson')
      .where('lesson is not null')
      .getMany();
  }

  findAll(params: ParticipationParams) {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<Participation>(
      this.participationsRepository,
      paginationOptions,
      {
        where: findOptions,
        order: orderOptions,
      },
    );
  }

  async findOne(id: number) {
    const lesson = await this.participationsRepository.findOne(id);
    if (!lesson) throw new BadRequestException('No se encontro la leccion');
    return lesson;
  }

  update(id: number, updateParticipationDto: UpdateParticipationDto) {
    return this.participationsRepository.update(id, updateParticipationDto);
  }

  async remove(id: number): Promise<void> {
    await this.participationsRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    const lessons = await this.participationsRepository.find();
    await this.participationsRepository.remove(lessons);
  }
}
