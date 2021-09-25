import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExercisesService } from '../exercises/exercises.service';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';

describe('LessonsService', () => {
  const mockRepository = {};
  let service: LessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: getRepositoryToken(Lesson),
          useValue: mockRepository,
        },
        ExercisesService,
      ],
    })
      .overrideProvider(ExercisesService)
      .useValue({})
      .compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
