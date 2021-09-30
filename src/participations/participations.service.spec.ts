import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamsService } from '../exams/exams.service';
import { LessonsService } from '../lessons/lessons.service';
import { UnitsService } from '../units/units.service';
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
        LessonsService,
        ExamsService,
        UnitsService,
        {
          provide: getRepositoryToken(Participation),
          useValue: {},
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue({})
      .overrideProvider(UnitsService)
      .useValue({})
      .overrideProvider(ExamsService)
      .useValue({})
      .overrideProvider(LessonsService)
      .useValue({})
      .compile();

    service = module.get<ParticipationsService>(ParticipationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
