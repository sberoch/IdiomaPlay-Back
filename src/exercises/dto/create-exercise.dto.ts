import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ExerciseType } from "../entities/exercise.entity";


export class CreateExerciseDto {
  @ApiProperty({ example: 'Test' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: ExerciseType, example: ExerciseType.LISTEN })
  @IsNotEmpty()
  type: ExerciseType;

  @ApiProperty({ type: [String], example: ["opcion1", "opcion2"] })
  @IsNotEmpty()
  options: string[];

  @ApiProperty({ example: 'opcion1' })
  @IsNotEmpty()
  correctOption: string;
}