import { FindConditions, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { ExamParams } from './dto/exam.params';
import { Exam } from './entities/exam.entity';

export const buildQuery = (params: ExamParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Exam> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};