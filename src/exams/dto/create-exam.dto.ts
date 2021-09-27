import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ example: 'Test' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [Number], example: [1, 2] })
  exercisesIds: number[];
}
