import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUnitStatDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  dailyPassedUnits: number;
}
