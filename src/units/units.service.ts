import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ExamnsService } from '../examns/examns.service';
import { LessonsService } from '../lessons/lessons.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Unit } from './entities/unit.entity';
import { UnitParams } from "./dto/unit.params";
import { buildQuery } from "./units.query-builder";
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Examn } from '../examns/entities/examn.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
    private lessonsService: LessonsService,
    private examnsService: ExamnsService
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    try {
      const { lessonsIds, examnId, ...rest } = createUnitDto;
      const lessons: Lesson[] = [];
      for (const lessonId of lessonsIds) {
        const lesson: Lesson = await this.lessonsService.findOne(lessonId);
        lessons.push(lesson);
      } 
      const examn: Examn = await this.examnsService.findOne(examnId);

      return this.unitsRepository.save(new Unit({ lessons, examn, ...rest }));
    } catch (e: unknown) {
      console.log(e)
    }

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

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return this.unitsRepository.update(id, updateUnitDto);
  }

  async remove(id: number): Promise<void> {
    await this.unitsRepository.delete(id);
  }
}