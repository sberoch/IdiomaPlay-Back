import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Exam } from '../exams/entities/exam.entity';
import { ExamsService } from '../exams/exams.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsService } from '../lessons/lessons.service';
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
  ) {}

  async create(createParticipationDto: CreateParticipationDto) {
    const { userId, examId, lessonId, ...rest } = createParticipationDto;
    if (!(examId || lessonId))
      throw new BadRequestException('Se debe proveer una leccion o un examen');
    const user = await this.usersService.findOne(userId);
    const lesson: Lesson | null = lessonId
      ? await this.lessonsService.findOne(lessonId)
      : null;
    const exam: Exam | null = examId
      ? await this.examsService.findOne(examId)
      : null;
    return this.participationsRepository.save(
      new Participation({ user, lesson, exam, ...rest }),
    );
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
    //TODO: change this when updateParticipationDto has update potential.
    console.log(updateParticipationDto);
    return this.participationsRepository.update(id, {});
  }

  async remove(id: number): Promise<void> {
    await this.participationsRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    const lessons = await this.participationsRepository.find();
    await this.participationsRepository.remove(lessons);
  }
}
