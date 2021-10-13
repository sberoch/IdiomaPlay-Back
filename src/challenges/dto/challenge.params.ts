import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class ChallengeParams extends PaginationParams {
  @ApiProperty({ required: false })
  title?: string;
}
