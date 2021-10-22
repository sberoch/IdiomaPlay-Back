import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChallengesService } from '../challenges/challenges.service';
import { Challenge } from '../challenges/entities/challenge.entity';
import { User } from '../users/entities/user.entity';

import { UsersService } from '../users/users.service';
import { ChallengeParticipationService } from './challengeParticipations.service';
import { CreateChallengeParticipationDto } from './dto/create-challengeParticipation.dto';
import { ChallengeParticipation } from './entities/challengeParticipation.entity';

describe('ChallengeParticipationsService', () => {
  let service: ChallengeParticipationService;
  let cParticipations: ChallengeParticipation[] = [];

  const dto: CreateChallengeParticipationDto = {
    challengeId: 1,
    userId: 1,
  };

  const mockRepository = {
    save: jest.fn().mockImplementation((dto) => {
      const challengeParticipation = new ChallengeParticipation({
        id: 1,
        ...dto,
      });
      cParticipations.push(challengeParticipation);
      return challengeParticipation;
    }),
    findOne: jest.fn().mockImplementation((id) => {
      return cParticipations.find(
        (actualCParticipation) => actualCParticipation.id === id,
      );
    }),
    find: jest.fn().mockImplementation(() => {
      return cParticipations;
    }),
    delete: jest.fn().mockImplementation((id) => {
      cParticipations = cParticipations.filter(
        (actualCParticipation) => actualCParticipation.id !== id,
      );
    }),
    remove: jest.fn().mockImplementation((_cParticipations) => {
      for (const actualCParticipation of _cParticipations) {
        cParticipations = cParticipations.filter(
          (_cParticipation) => _cParticipation !== actualCParticipation,
        );
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeParticipationService,
        {
          provide: getRepositoryToken(ChallengeParticipation),
          useValue: mockRepository,
        },
        UsersService,
        ChallengesService,
      ],
    })
      .overrideProvider(UsersService)
      .useValue({
        findOneWithData: (userId) => {
          return new User({ id: userId });
        },
        update: (userId, newDto) => {
          return new User({ id: userId, ...newDto });
        },
      })
      .overrideProvider(ChallengesService)
      .useValue({
        findOne: (challengeId) => {
          return new Challenge({ id: challengeId });
        },
        isChallengePassedByUser: () => {
          return false;
        },
      })
      .compile();

    service = module.get<ChallengeParticipationService>(
      ChallengeParticipationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create correctly', async () => {
    const expected: ChallengeParticipation = new ChallengeParticipation({
      id: 1,
      user: new User({ id: 1 }),
      challenge: new Challenge({ id: 1 }),
    });
    const created = await service.create(dto);
    expect(created).toEqual(expected);
  });

  it('should throw if userId is null', async () => {
    await expect(service.findOne(null)).rejects.toThrow();
  });

  it('should remove challenge participation from user correctly', async () => {
    const user = new User({
      id: 1,
      challengeParticipation: new ChallengeParticipation(),
    });
    service.removeByUserId(1);
    expect(user.challengeParticipation).toEqual({});
  });

  it('should remove correctly', async () => {
    await service.create(dto);
    await service.remove(1);
    expect(cParticipations.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    await service.create(dto);
    await service.create(dto);
    await service.removeAll();
    expect(cParticipations.length).toEqual(0);
  });
});
