import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class UserParams extends PaginationParams {
  @ApiProperty({ required: false })
  name: string;
}
