import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ChallengeParticipationService } from '../challengeParticipations/challengeParticipations.service';
import { config } from '../common/config';
import { Exam } from '../exams/entities/exam.entity';
import { ExamsService } from '../exams/exams.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsService } from '../lessons/lessons.service';
import { Unit } from '../units/entities/unit.entity';
import { UnitsService } from '../units/units.service';
import { User } from '../users/entities/user.entity';
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
    private challengeParticipationsService: ChallengeParticipationService,
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
    const user = await this.usersService.findOneWithData(userId);
    const unit = await this.unitsService.findOne(unitId);
    await this.challengeParticipationsService.createIfNotExists(
      userId,
      unit.challenge.id,
    );
    let lesson: Lesson;
    if (lessonId) {
      lesson = await this.lessonsService.findOneWithExercises(lessonId);
      const participation = new Participation({ user, lesson, unit, ...rest });
      return this.participationsRepository.save(participation);
    }
    let exam: Exam;
    if (examId) {
      exam = await this.examsService.findOneWithExercises(examId);
      const examAttempts = await this.countFailedExamAttempts(user, unit);
      const newParticipation = new Participation({
        user,
        exam,
        unit,
        ...rest,
      });
      if (!newParticipation.isPassed && examAttempts >= 2) {
        await this.removeMany(user, unit);
      } else {
        if (newParticipation.isPassed) {
          await this.usersService.addExamPoints(user.id);
        }
        const res = await this.participationsRepository.save(newParticipation);
        await this.challengeParticipationsService.removeIfCompleted(
          user,
          unit.challenge.id,
        );
        return res;
      }
    }
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
    for (const participation of participations) {
      const elemInLatest = latest.find(
        (it) => it.lesson.id === participation.lesson.id,
      );
      if (elemInLatest) {
        latest[latest.findIndex((it) => it === elemInLatest)] =
          participation.createdAt > elemInLatest.createdAt
            ? participation
            : elemInLatest;
      } else {
        latest.push(participation);
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
      .andWhere('user.id = :userId', { userId })
      .leftJoinAndSelect('p.lesson', 'lesson')
      .andWhere('lesson is not null')
      .getMany();
  }

  // Devuelvo solo el isUnitPassed en los examenes

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

  findAllWithData() {
    return this.participationsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.lesson', 'lessons')
      .leftJoinAndSelect('p.exam', 'exams')
      .leftJoinAndSelect('p.unit', 'units')
      .leftJoinAndSelect('p.user', 'users')
      .getMany();
  }

  async countFailedExamAttempts(user: User, unit: Unit): Promise<number> {
    return this.participationsRepository
      .createQueryBuilder('p')
      .leftJoin('p.unit', 'unit')
      .where('unit.id = :unitId', { unitId: unit.id })
      .leftJoin('p.user', 'user')
      .andWhere('user.id = :userId', { userId: user.id })
      .leftJoinAndSelect('p.lesson', 'lesson')
      .andWhere('lesson is null')
      .andWhere('p.correctExercises * 100 < p.totalExercises * :passAmount', {
        passAmount: +config.passingPercentage * 100, //No puedo usar isPassed ni floats. Esto lo arreglo rapido
      })
      .getCount();
  }

  async findOne(id: number) {
    const lesson = await this.participationsRepository.findOne(id);
    if (!lesson) throw new BadRequestException('No se encontro la leccion');
    return lesson;
  }

  async findOneWithData(id: number) {
    return this.participationsRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id: id })
      .leftJoinAndSelect('p.lesson', 'lessons')
      .leftJoinAndSelect('p.exam', 'exams')
      .leftJoinAndSelect('p.unit', 'units')
      .leftJoinAndSelect('p.user', 'users')
      .getOne();
  }

  async update(id: number, dto: UpdateParticipationDto) {
    const participation = await this.participationsRepository.findOne(id);
    if (this.shouldAddExercisePoints(participation, dto)) {
      await this.usersService.addExercisePoints(dto.userId);
      return this.participationsRepository.update(id, {
        correctExercises: dto.correctExercises,
      });
    } else if (this.shouldAddExamPoints(dto, participation)) {
      await this.usersService.addExamPoints(dto.userId);
      return this.participationsRepository.update(id, {
        correctExercises: dto.correctExercises,
      });
    }
    return 'Nada que actualizar';
  }

  async remove(id: number): Promise<void> {
    await this.participationsRepository.delete(id);
  }

  async removeMany(user: User, unit: Unit) {
    this.participationsRepository.delete({
      unit,
      user,
    });
  }

  async removeAll(): Promise<void> {
    const lessons = await this.participationsRepository.find();
    await this.participationsRepository.remove(lessons);
  }

  private shouldAddExamPoints(
    dto: UpdateParticipationDto,
    participation: Participation,
  ) {
    return (
      dto.userId &&
      dto.examId &&
      !dto.lessonId &&
      dto.correctExercises >=
        config.amountOfExercisesPerExam * config.passingPercentage &&
      participation.correctExercises <
        config.amountOfExercisesPerExam * config.passingPercentage
    );
  }

  private shouldAddExercisePoints(
    participation: Participation,
    dto: UpdateParticipationDto,
  ) {
    return (
      participation.correctExercises < dto.correctExercises &&
      !dto.isRetry &&
      dto.userId &&
      dto.lessonId &&
      !dto.examId
    );
  }
}
