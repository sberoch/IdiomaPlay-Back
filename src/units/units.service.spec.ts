import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamsService } from '../exams/exams.service';
import { LessonsService } from '../lessons/lessons.service';
import { Unit } from './entities/unit.entity';
import { UnitsService } from './units.service';

describe('UnitsService', () => {
  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
  };
  let service: UnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitsService,
        LessonsService,
        ExamsService,
        {
          provide: getRepositoryToken(Unit),
          useValue: mockRepository,
        },
      ],
    })
      .overrideProvider(LessonsService)
      .useValue({})
      .overrideProvider(ExamsService)
      .useValue({})
      .compile();

    service = module.get<UnitsService>(UnitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
