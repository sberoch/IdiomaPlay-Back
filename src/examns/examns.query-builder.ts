import { FindConditions, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { ExamnParams } from "./dto/examn.params";
import { Examn } from "./entities/examn.entity";

export const buildQuery = (params: ExamnParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<Examn> = {};
  if (params.title) {
    findOptions.title = ILike(`%${params.title}%`);
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
