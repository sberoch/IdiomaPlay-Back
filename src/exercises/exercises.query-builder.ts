import { FindConditions, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { ExerciseParams } from "./dto/exercise.params";
import { Exercise } from "./entities/exercise.entity";

export const buildQuery = (params: ExerciseParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Exercise> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
