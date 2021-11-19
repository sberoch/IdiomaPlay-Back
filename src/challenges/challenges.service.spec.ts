import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengesService } from './challenges.service';
import { UnitsService } from '../units/units.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Unit } from '../units/entities/unit.entity';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let challenges: Challenge[] = [];
  const lessonDto: CreateChallengeDto = {
    title: 'Test',
    units: [],
  };
  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findOne: jest.fn().mockImplementation((id) => {
      return challenges.find((actualChallenge) => actualChallenge.id === id);
    }),
    find: jest.fn().mockImplementation(() => {
      return challenges;
    }),
    delete: jest.fn().mockImplementation((id) => {
      challenges = challenges.filter(
        (actualChallenge) => actualChallenge.id !== id,
      );
    }),
    remove: jest.fn().mockImplementation((_challenges) => {
      for (const actualChallenge of _challenges) {
        challenges = challenges.filter((l) => l !== actualChallenge);
      }
    }),
  };

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
      .useValue({
        findOne: (id) => {
          return new Unit({ id });
        },
      })
      .compile();

    challenges = [];
    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if lessonId is null', async () => {
    await expect(service.findOne(null)).rejects.toThrow();
  });

  it('should remove correctly', async () => {
    await service.create(lessonDto);
    await service.remove(1);
    expect(challenges.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    await service.create(lessonDto);
    await service.create(lessonDto);
    await service.removeAll();
    expect(challenges.length).toEqual(0);
  });
});
