import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamsService } from '../exams/exams.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsService } from '../lessons/lessons.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Unit } from './entities/unit.entity';
import { UnitsService } from './units.service';

describe('UnitsService', () => {
  let service: UnitsService;
  let units: Unit[] = [];

  const unitDto: CreateUnitDto = {
    lessons: [],
    title: 'Test',
  };

  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findOne: jest.fn().mockImplementation((id) => {
      return units.find((actualUnit) => actualUnit.id === id);
    }),
    find: jest.fn().mockImplementation(() => {
      return units;
    }),
    delete: jest.fn().mockImplementation((id) => {
      units = units.filter((actualUnit) => actualUnit.id !== id);
    }),
    remove: jest.fn().mockImplementation((_units) => {
      for (const actualUnit of _units) {
        units = units.filter((_participation) => _participation !== actualUnit);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitsService,
        LessonsService,
        ExamsService,
        {
          provide: getRepositoryToken(Unit),
          useValue: mockRepository,
        },
      ],
    })
      .overrideProvider(LessonsService)
      .useValue({
        findOne: (lessonId) => {
          return new Lesson({ id: lessonId });
        },
        findExercisesIds: (ids) => ids,
      })
      .overrideProvider(ExamsService)
      .useValue({
        create: jest.fn().mockReturnThis(),
      })
      .compile();

    units = [];
    service = module.get<UnitsService>(UnitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if userId is null', async () => {
    await expect(service.findOne(null)).rejects.toThrow();
  });

  it('should remove correctly', async () => {
    await service.create(unitDto);
    await service.remove(1);
    expect(units.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    await service.create(unitDto);
    await service.create(unitDto);
    await service.removeAll();
    expect(units.length).toEqual(0);
  });
});
