import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Participation } from './entities/participation.entity';
import { ParticipationsService } from './participations.service';

describe('ParticipationsService', () => {
  let service: ParticipationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipationsService,
        UsersService,
        {
          provide: getRepositoryToken(Participation),
          useValue: {},
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue({})
      .compile();

    service = module.get<ParticipationsService>(ParticipationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
