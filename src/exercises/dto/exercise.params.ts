import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class ExerciseParams extends PaginationParams {
  @ApiProperty({ required: false })
  title: string;
}
