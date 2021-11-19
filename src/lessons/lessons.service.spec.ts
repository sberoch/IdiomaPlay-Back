import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';

describe('LessonsService', () => {
  let service: LessonsService;
  let lessons: Lesson[] = [];
  const lessonDto: CreateLessonDto = {
    title: 'Test',
    exercises: [],
  };

  const mockRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findOne: jest.fn().mockImplementation((id) => {
      return lessons.find((actualLesson) => actualLesson.id === id);
    }),
    find: jest.fn().mockImplementation(() => {
      return lessons;
    }),
    delete: jest.fn().mockImplementation((id) => {
      lessons = lessons.filter((actualLesson) => actualLesson.id !== id);
    }),
    remove: jest.fn().mockImplementation((_lessons) => {
      for (const actualLesson of _lessons) {
        lessons = lessons.filter((l) => l !== actualLesson);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: getRepositoryToken(Lesson),
          useValue: mockRepository,
        },
        ExercisesService,
      ],
    })
      .overrideProvider(ExercisesService)
      .useValue({
        findOne: (id) => {
          return new Exercise({ id });
        },
      })
      .compile();
    lessons = [];
    service = module.get<LessonsService>(LessonsService);
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
    expect(lessons.length).toEqual(0);
  });

  it('should remove all correctly', async () => {
    await service.create(lessonDto);
    await service.create(lessonDto);
    await service.removeAll();
    expect(lessons.length).toEqual(0);
  });
});
