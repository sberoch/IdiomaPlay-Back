import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './common/config';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { ExercisesModule } from './exercises/exercises.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), UsersModule, ExercisesModule, LessonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
