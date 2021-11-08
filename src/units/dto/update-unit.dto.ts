import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exam } from '../../exams/entities/exam.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { CreateUnitDto } from './create-unit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @ApiProperty({ type: [Lesson], required: false })
  lessons?: Lesson[];

  @ApiProperty({ type: [Exam], required: false })
  exam?: Exam;
}
