import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class ExamParams extends PaginationParams {
  @ApiProperty({ required: false })
  title: string;
}
