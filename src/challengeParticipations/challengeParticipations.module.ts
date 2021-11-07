import { Module } from '@nestjs/common';
import { ChallengeParticipationService } from './challengeParticipations.service';
import { ChallengeParticipationController } from './challengeParticipations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeParticipation } from './entities/challengeParticipation.entity';
import { UsersModule } from '../users/users.module';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChallengeParticipation]),
    UsersModule,
    ChallengesModule,
  ],
  controllers: [ChallengeParticipationController],
  providers: [ChallengeParticipationService],
  exports: [ChallengeParticipationService],
})
export class ChallengeParticipationModule {}
