import { FindConditions, ILike } from 'typeorm';
import { config } from '../common/config';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { UserParams } from './dto/user.params';
import { User } from './entities/user.entity';

export const buildQuery = (params: UserParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<User> = {};
  if (params.email) {
    findOptions.email = ILike(`%${params.email}%`);
  }

  findOptions.role = config.roles.common;

  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
