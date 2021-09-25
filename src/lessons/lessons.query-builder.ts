import { FindConditions, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { LessonParams } from './dto/lesson.params';
import { Lesson } from './entities/lesson.entity';

export const buildQuery = (params: LessonParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Lesson> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
