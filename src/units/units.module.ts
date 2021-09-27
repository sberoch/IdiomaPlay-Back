import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { LessonsModule } from '../lessons/lessons.module';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Unit]), LessonsModule, ExamsModule],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
