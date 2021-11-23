import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { CreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @ApiProperty({ type: [Exercise], required: false })
  exercises?: Exercise[];
}
