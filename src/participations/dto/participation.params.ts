import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class ParticipationParams extends PaginationParams {
  @ApiProperty({ required: false })
  user?: number;
}
