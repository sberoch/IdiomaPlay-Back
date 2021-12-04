import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeParticipationModule } from '../challengeParticipations/challengeParticipations.module';
import { ExamsModule } from '../exams/exams.module';
import { LessonsModule } from '../lessons/lessons.module';
import { StatsModule } from '../stats/stats.module';
import { UnitsModule } from '../units/units.module';
import { UsersModule } from '../users/users.module';
import { Participation } from './entities/participation.entity';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    UsersModule,
    LessonsModule,
    ExamsModule,
    UnitsModule,
    StatsModule,
    ChallengeParticipationModule,
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}
