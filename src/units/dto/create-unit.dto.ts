import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateLessonDto } from '../../lessons/dto/create-lesson.dto';

export class CreateUnitDto {
  @ApiProperty({ example: 'Test unit' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [CreateLessonDto] })
  lessons: CreateLessonDto[];
}
