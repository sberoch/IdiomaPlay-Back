import { Module } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './entities/participation.entity';
import { UsersModule } from '../users/users.module';
import { LessonsModule } from '../lessons/lessons.module';
import { ExamsModule } from '../exams/exams.module';
import { UnitsModule } from '../units/units.module';
import { ChallengeParticipationModule } from '../challengeParticipations/challengeParticipations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    UsersModule,
    LessonsModule,
    ExamsModule,
    UnitsModule,
    ChallengeParticipationModule,
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}
