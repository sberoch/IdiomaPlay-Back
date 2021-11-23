import { PartialType } from '@nestjs/swagger';
import { ChallengeParticipation } from '../../challengeParticipations/entities/challengeParticipation.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  challengeParticipation?: ChallengeParticipation
}
