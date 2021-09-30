import { Module } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './entities/participation.entity';
import { UsersModule } from '../users/users.module';
import { LessonsModule } from '../lessons/lessons.module';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    UsersModule,
    LessonsModule,
    ExamsModule,
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
})
export class ParticipationsModule {}
