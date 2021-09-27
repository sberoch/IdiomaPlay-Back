import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { LessonsModule } from '../lessons/lessons.module';
import { ExamnsModule } from '../examns/examns.module';

@Module({
  imports: [TypeOrmModule.forFeature([Unit]), LessonsModule, ExamnsModule],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
