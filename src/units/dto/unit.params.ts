import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class UnitParams extends PaginationParams {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false, example: 1 })
  challenge?: number;
}
