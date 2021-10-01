import { Module } from '@nestjs/common';
import { ExamsModule } from '../../exams/exams.module';
import { ExercisesModule } from '../../exercises/exercises.module';
import { LessonsModule } from '../../lessons/lessons.module';
import { UsersModule } from '../../users/users.module';
import { LoaderService } from './loader.service';

@Module({
  imports: [ExercisesModule, UsersModule, LessonsModule, ExamsModule],
  providers: [LoaderService],
})
export class LoaderModule {}
