import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeParticipationService } from './challengeParticipations.service';

describe('ChallengeParticipationService', () => {
  let service: ChallengeParticipationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengeParticipationService],
    }).compile();

    service = module.get<ChallengeParticipationService>(ChallengeParticipationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
