import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { ExercisesService } from './exercises.service';

describe('ExercisesService', () => {
  let exercises: Exercise[] = [];
  const mockRepository = {
    save: jest.fn().mockImplementation((dto) => {
      exercises.push({ id: 1, ...dto });
      return { id: 1, ...dto };
    }),
    findOne: jest.fn().mockImplementation((id) => {
      return exercises.find((ex) => ex.id === id);
    }),
    find: jest.fn().mockImplementation(() => {
      return exercises;
    }),
    delete: jest.fn().mockImplementation((id) => {
      exercises = exercises.splice(id, 1);
    }),
    remove: jest.fn().mockImplementation((_exercises) => {
      for (const ex of _exercises) {
        exercises = exercises.filter((_ex) => _ex !== ex);
      }
    }),
  };
  let service: ExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: getRepositoryToken(Exercise),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    exercises = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create correctly', async () => {
    const dto: CreateExerciseDto = {
      title: 'Test',
      sentence: 'Sentence',
      options: ['1', '2', '3'],
      correctOption: '1',
      type: ExerciseType.COMPLETE,
    };
    expect(await service.create(dto)).toEqual({
      id: 1,
      sentence: 'Sentence',
      title: 'Test',
      options: ['1', '2', '3'],
      correctOption: '1',
      type: ExerciseType.COMPLETE,
    });
  });

  it('should throw if userId is null', async () => {
    await expect(service.findOne(null)).rejects.toThrow();
  });

  it('should remove correctly', async () => {
    const dto: CreateExerciseDto = {
      title: 'Test',
      sentence: 'Sentence',
      options: ['1', '2', '3'],
      correctOption: '1',
      type: ExerciseType.COMPLETE,
    };
    await service.create(dto);
    await service.remove(1);
    expect(exercises.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    const dto: CreateExerciseDto = {
      title: 'Test',
      sentence: 'Sentence',
      options: ['1', '2', '3'],
      correctOption: '1',
      type: ExerciseType.COMPLETE,
    };
    await service.create(dto);
    await service.create(dto);
    await service.removeAll();
    expect(exercises.length).toEqual(0);
  });
});
