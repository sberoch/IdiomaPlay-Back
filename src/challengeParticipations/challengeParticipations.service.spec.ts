import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChallengesService } from '../challenges/challenges.service';

import { UsersService } from '../users/users.service';
import { ChallengeParticipationService } from './challengeParticipations.service';
import { ChallengeParticipation } from './entities/challengeParticipation.entity';

describe('LessonsService', () => {
  const mockRepository = {};
  let service: ChallengeParticipationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeParticipationService,
        {
          provide: getRepositoryToken(ChallengeParticipation),
          useValue: mockRepository,
        },
        UsersService,
        ChallengesService
      ],
    })
      .overrideProvider(UsersService)
      .useValue({})
      .overrideProvider(ChallengesService)
      .useValue({})
      .compile();

    service = module.get<ChallengeParticipationService>(ChallengeParticipationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
