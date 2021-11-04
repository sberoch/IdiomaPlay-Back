import { FindConditions, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { Unit } from '../units/entities/unit.entity';
import { LessonParams } from './dto/lesson.params';
import { Lesson } from './entities/lesson.entity';

export const buildQuery = (params: LessonParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Lesson> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  if (params.unit) {
    findOptions.unit = params.unit as FindConditions<Unit>;
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
