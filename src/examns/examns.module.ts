import { Module } from '@nestjs/common';
import { ExamnsService } from './examns.service';
import { ExamnsController } from './examns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examn } from './entities/examn.entity';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [TypeOrmModule.forFeature([Examn]), ExercisesModule],
  controllers: [ExamnsController],
  providers: [ExamnsService],
  exports: [ExamnsService]
})
export class ExamnsModule {}
