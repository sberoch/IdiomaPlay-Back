import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { config } from '../common/config';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  let users: User[] = [];

  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findOne: jest.fn().mockImplementation((id) => {
      return users.find((actualUser) => actualUser.id === id);
    }),
    find: jest.fn().mockImplementation(() => {
      return users;
    }),
    delete: jest.fn().mockImplementation((id) => {
      users = users.filter((actualUser) => actualUser.id !== id);
    }),
    remove: jest.fn().mockImplementation((_users: User[]) => {
      users = users.filter((actualUser) => !_users.includes(actualUser));
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    users = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('points', () => {
    it('should add exercise points correctly', async () => {
      users.push(new User({ id: 1, email: 'test@test.com' }));
      await service.addExercisePoints(1);
      expect(users[0].points).toEqual(config.pointsEarnedByExercise);
    });

    it('should add exam points correctly', async () => {
      users.push(new User({ id: 1, email: 'test@test.com' }));
      await service.addExamPoints(1);
      expect(users[0].points).toEqual(config.pointsEarnedByExam);
    });

    it('should add challenge points correctly', async () => {
      users.push(new User({ id: 1, email: 'test@test.com' }));
      await service.addChallengePoints(1);
      expect(users[0].points).toEqual(config.pointsEarnedByChallenge);
    });
  });

  it('should throw if userId is null', async () => {
    await expect(service.findOne(null)).rejects.toThrow();
  });

  it('should remove correctly', async () => {
    users.push(new User({ id: 1, email: 'test@test.com' }));
    await service.remove(1);
    expect(users.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    users.push(new User({ id: 1, email: 'test@test.com' }));
    users.push(new User({ id: 1, email: 'test2@test.com' }));
    await service.removeAll();
    expect(users.length).toEqual(0);
  });
});
