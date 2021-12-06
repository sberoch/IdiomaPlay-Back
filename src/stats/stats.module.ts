import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamStat } from './entities/exam-stat.entity';
import { UnitStat } from './entities/unit-stat.entity';
import { UserStat } from './entities/user-stat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamStat, UnitStat, UserStat])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
