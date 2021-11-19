import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateExerciseDto } from '../../exercises/dto/create-exercise.dto';

export class CreateLessonDto {
  @ApiProperty({ example: 'Test lesson' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [CreateExerciseDto] })
  exercises: CreateExerciseDto[];
}
