import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateUnitDto } from '../../units/dto/create-unit.dto';

export class CreateChallengeDto {
  @ApiProperty({ example: 'Test' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [CreateUnitDto] })
  units: CreateUnitDto[];
}
