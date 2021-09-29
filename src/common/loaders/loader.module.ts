import { Module } from '@nestjs/common';
import { ExercisesModule } from '../../exercises/exercises.module';
import { LoaderService } from './loader.service';

@Module({
  imports: [ExercisesModule],
  providers: [LoaderService],
})
export class LoaderModule {}
