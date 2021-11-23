import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class ParticipationParams extends PaginationParams {
  @ApiProperty({ required: false, example: 1 })
  user?: number;

  @ApiProperty({ required: false, example: 1 })
  unit?: number;

  @ApiProperty({
    required: false,
    description:
      'If true returns array of objects with the following shape: {lessonId: 1, passed: true}. unit and user required if this is true.',
    example: false,
  })
  withPassedLessons?: string;
}
