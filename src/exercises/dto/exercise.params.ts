import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';
import { ExerciseType } from '../entities/exercise.entity';

export class ExerciseParams extends PaginationParams {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  sentence?: string;

  @ApiProperty({
    required: false,
    enum: ExerciseType,
  })
  type?: ExerciseType;
}
