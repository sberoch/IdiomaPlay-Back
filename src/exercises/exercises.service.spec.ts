import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { ExercisesService } from './exercises.service';

describe('ExercisesService', () => {
  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
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
});
