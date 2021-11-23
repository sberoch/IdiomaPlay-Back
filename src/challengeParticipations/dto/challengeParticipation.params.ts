import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class ChallengeParticipationParams extends PaginationParams {
  @ApiProperty({ required: false })
  userId?: number;

  @ApiProperty({ required: false })
  challengeId?: number;
}
