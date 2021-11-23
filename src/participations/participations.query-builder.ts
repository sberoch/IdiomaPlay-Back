import { FindConditions } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { Unit } from '../units/entities/unit.entity';
import { User } from '../users/entities/user.entity';
import { ParticipationParams } from './dto/participation.params';
import { Participation } from './entities/participation.entity';

export const buildQuery = (params: ParticipationParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Participation> = {};
  if (params.user) {
    findOptions.user = params.user as FindConditions<User>;
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
