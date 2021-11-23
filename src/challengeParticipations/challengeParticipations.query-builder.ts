import { FindConditions } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { ChallengeParticipationParams } from './dto/challengeParticipation.params';

export const buildQuery = (params: ChallengeParticipationParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<ChallengeParticipationParams> = {};

  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
