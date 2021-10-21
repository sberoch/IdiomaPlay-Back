import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exam } from '../exams/entities/exam.entity';
import { ExamsService } from '../exams/exams.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsService } from '../lessons/lessons.service';
import { Unit } from '../units/entities/unit.entity';
import { UnitsService } from '../units/units.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { Participation } from './entities/participation.entity';
import { ParticipationsService } from './participations.service';
import { config } from '../common/config';

describe('ParticipationsService', () => {
  let service: ParticipationsService;
  let participations: Participation[] = [];

  const lessonDto: CreateParticipationDto = {
    userId: 1,
    unitId: 1,
    lessonId: 1,
    examId: null,
    correctExercises: 0,
  };

  const examDto: CreateParticipationDto = {
    userId: 1,
    unitId: 1,
    lessonId: null,
    examId: 1,
    correctExercises: 0,
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
    })),
    save: jest.fn().mockImplementation((dto) => {
      const participation = new Participation({ id: 1, ...dto });
      participations.push(participation);
      return participation;
    }),
    findOne: jest.fn().mockImplementation((id) => {
      return participations.find(
        (actualParticipation) => actualParticipation.id === id,
      );
    }),
    find: jest.fn().mockImplementation(() => {
      return participations;
    }),
    delete: jest.fn().mockImplementation((id) => {
      participations = participations.filter(
        (actualParticipation) => actualParticipation.id !== id,
      );
    }),
    remove: jest.fn().mockImplementation((_participations) => {
      for (const actualParticipation of _participations) {
        participations = participations.filter(
          (_participation) => _participation !== actualParticipation,
        );
      }
    }),
  };

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
          useValue: mockRepository,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue({
        findOne: (userId) => {
          return new User({ id: userId });
        },
      })
      .overrideProvider(UnitsService)
      .useValue({
        findOne: (unitId) => {
          return new Unit({ id: unitId });
        },
      })
      .overrideProvider(ExamsService)
      .useValue({
        findOne: (examId) => {
          return new Exam({ id: examId });
        },
        findOneWithExercises: (lessonId) => {
          return new Exam({ id: lessonId, exercises: [] });
        },
      })
      .overrideProvider(LessonsService)
      .useValue({
        findOne: (lessonId) => {
          return new Lesson({ id: lessonId });
        },
        findOneWithExercises: (lessonId) => {
          return new Lesson({ id: lessonId, exercises: [] });
        },
      })
      .compile();

    service = module.get<ParticipationsService>(ParticipationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create lesson participation correctly', async () => {
    const expected: Participation = new Participation({
      id: 1,
      user: new User({ id: 1 }),
      unit: new Unit({ id: 1 }),
      lesson: new Lesson({ id: 1, exercises: [] }),
      totalExercises: config.amountOfExercisesPerLesson,
      correctExercises: 0,
    });
    const created = await service.create(lessonDto);
    expect(created).toEqual(expected);
  });

  it('should create exam participation correctly', async () => {
    const expected: Participation = new Participation({
      id: 1,
      user: new User({ id: 1 }),
      unit: new Unit({ id: 1 }),
      exam: new Exam({ id: 1, exercises: [] }),
      totalExercises: config.amountOfExercisesPerExam,
      correctExercises: 0,
    });
    const created = await service.create(examDto);
    expect(created).toEqual(expected);
  });

  it('should throw if userId is null', async () => {
    await expect(service.findOne(null)).rejects.toThrow();
  });

  it('should remove correctly', async () => {
    await service.create(lessonDto);
    await service.remove(1);
    expect(participations.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    await service.create(lessonDto);
    await service.create(lessonDto);
    await service.removeAll();
    expect(participations.length).toEqual(0);
  });
});
