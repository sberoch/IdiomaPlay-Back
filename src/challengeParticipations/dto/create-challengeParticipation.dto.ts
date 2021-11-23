import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeParticipationDto {
  @ApiProperty({ example: 1 })
  challengeId: number;

  @ApiProperty({ example: 1 })
  userId: number;
}
