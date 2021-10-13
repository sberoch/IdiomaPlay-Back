import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExercisesService } from '../exercises/exercises.service';
import { Challenge } from './entities/challenge.entity';
import { ChallengesService } from './challenges.service';
import { UnitsService } from '../units/units.service';

describe('ChallengesService', () => {
  const mockRepository = {};
  let service: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: getRepositoryToken(Challenge),
          useValue: mockRepository,
        },
        UnitsService,
      ],
    })
      .overrideProvider(UnitsService)
      .useValue({})
      .compile();

    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
