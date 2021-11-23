import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeParticipationController } from './challengeParticipations.controller';
import { ChallengeParticipationService } from './challengeParticipations.service';

describe('ChallengeParticipationController', () => {
  let controller: ChallengeParticipationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeParticipationController],
      providers: [ChallengeParticipationService],
    })
      .overrideProvider(ChallengeParticipationService)
      .useValue({})
      .compile();

    controller = module.get<ChallengeParticipationController>(
      ChallengeParticipationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
