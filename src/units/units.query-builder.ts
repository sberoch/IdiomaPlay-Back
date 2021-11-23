import { FindConditions, ILike } from 'typeorm';
import { Challenge } from '../challenges/entities/challenge.entity';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { UnitParams } from './dto/unit.params';
import { Unit } from './entities/unit.entity';

export const buildQuery = (params: UnitParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Unit> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  if (params.challenge) {
    findOptions.challenge = params.challenge as FindConditions<Challenge>;
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
