import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateParticipationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  unitId: number;

  @ApiProperty({ example: 1, required: false })
  lessonId?: number;

  @ApiProperty({ example: null, required: false })
  examId?: number;

  @ApiProperty({ example: 1 })
  correctExercises: number;
}
