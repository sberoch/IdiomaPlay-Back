import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), ExercisesModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
