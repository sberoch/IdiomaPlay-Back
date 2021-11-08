import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Unit } from '../../units/entities/unit.entity';
import { CreateChallengeDto } from './create-challenge.dto';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {
  @ApiProperty({ type: [Unit], required: false })
  units?: Unit[];
}
