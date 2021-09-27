import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({ example: 'Test unit' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1 })
  examId: number;

  @ApiProperty({ type: [Number], example: [1, 2] })
  lessonsIds: number[];
}
