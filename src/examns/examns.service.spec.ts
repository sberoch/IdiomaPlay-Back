import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExercisesModule } from '../exercises/exercises.module';
import { ExercisesService } from '../exercises/exercises.service';
import { Examn } from './entities/examn.entity';
import { ExamnsService } from './examns.service';

describe('ExamnsService', () => {
  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
  };
  let service: ExamnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamnsService, ExercisesService, {
        provide: getRepositoryToken(Examn),
        useValue: mockRepository,
      }],
    }).overrideProvider(ExercisesService).useValue({}).compile();

    service = module.get<ExamnsService>(ExamnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
