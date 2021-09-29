import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateParticipationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number;
}
