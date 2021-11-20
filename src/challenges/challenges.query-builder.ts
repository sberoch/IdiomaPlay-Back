import { FindConditions, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { ChallengeParams } from './dto/challenge.params';
import { Challenge } from './entities/challenge.entity';

export const buildQuery = (params: ChallengeParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Challenge> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  findOptions.enabled = true;
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
