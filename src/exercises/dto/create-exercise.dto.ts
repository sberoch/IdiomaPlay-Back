import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ExerciseType } from '../entities/exercise.entity';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Test' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '* is my sisters.' })
  @IsNotEmpty()
  sentence: string;

  @ApiProperty({ enum: ExerciseType, example: ExerciseType.COMPLETE })
  @IsNotEmpty()
  type: ExerciseType;

  @ApiProperty({ type: [String], example: ['she', 'he', 'they', 'we'] })
  @IsNotEmpty()
  options: string[];

  @ApiProperty({ example: 'she' })
  @IsNotEmpty()
  correctOption: string;
}
