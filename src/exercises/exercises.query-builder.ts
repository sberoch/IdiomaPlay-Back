import { FindConditions, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { ExerciseParams } from './dto/exercise.params';
import { Exercise } from './entities/exercise.entity';

export const buildQuery = (params: ExerciseParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Exercise> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  if (params.sentence) {
    findOptions.sentence = ILike(`%${params.sentence}%`);
  }
  if (params.type) {
    findOptions.type = params.type;
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
