import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entities/exam.entity';
import { ExamsService } from './exams.service';

describe('ExamsService', () => {
  let service: ExamsService;
  let exams: Exam[] = [];
  const lessonDto: CreateExamDto = {
    title: 'Test',
    exercisesIds: [1, 2],
  };
  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findOne: jest.fn().mockImplementation((id) => {
      return exams.find((actualExam) => actualExam.id === id);
    }),
    find: jest.fn().mockImplementation(() => {
      return exams;
    }),
    delete: jest.fn().mockImplementation((id) => {
      exams = exams.filter((actualExam) => actualExam.id !== id);
    }),
    remove: jest.fn().mockImplementation((_exams) => {
      for (const actualExam of _exams) {
        exams = exams.filter((l) => l !== actualExam);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        ExercisesService,
        {
          provide: getRepositoryToken(Exam),
          useValue: mockRepository,
        },
      ],
    })
      .overrideProvider(ExercisesService)
      .useValue({
        findOne: (id) => {
          return new Exercise({ id });
        },
      })
      .compile();

    exams = [];
    service = module.get<ExamsService>(ExamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if examId is null', async () => {
    await expect(service.findOne(null)).rejects.toThrow();
  });

  it('should remove correctly', async () => {
    await service.create(lessonDto);
    await service.remove(1);
    expect(exams.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    await service.create(lessonDto);
    await service.create(lessonDto);
    await service.removeAll();
    expect(exams.length).toEqual(0);
  });
});
