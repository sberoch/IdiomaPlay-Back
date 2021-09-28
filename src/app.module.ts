import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './common/config';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { ExercisesModule } from './exercises/exercises.module';
import { LessonsModule } from './lessons/lessons.module';
import { UnitsModule } from './units/units.module';
import { ExamsModule } from './exams/exams.module';
import { LoaderModule } from "./common/loaders/loader.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ExercisesModule,
    LessonsModule,
    ExamsModule,
    UnitsModule,
    LoaderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
