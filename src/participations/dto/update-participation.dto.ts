import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateParticipationDto } from './create-participation.dto';

export class UpdateParticipationDto extends PartialType(
  CreateParticipationDto,
) {
  @ApiProperty({ example: 1 })
  correctExercises: number;
}
