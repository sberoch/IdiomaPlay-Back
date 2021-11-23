import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { ExercisesModule } from '../exercises/exercises.module';
import { ExamsController } from './exams.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), ExercisesModule],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
