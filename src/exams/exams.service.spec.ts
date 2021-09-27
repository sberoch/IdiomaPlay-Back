import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExercisesService } from '../exercises/exercises.service';
import { Exam } from './entities/exam.entity';
import { ExamsService } from './exams.service';

describe('ExamsService', () => {
  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
  };
  let service: ExamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        ExercisesService,
        {
          provide: getRepositoryToken(Exam),
          useValue: mockRepository,
        },
      ],
    })
      .overrideProvider(ExercisesService)
      .useValue({})
      .compile();

    service = module.get<ExamsService>(ExamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
