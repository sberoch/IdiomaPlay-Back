import { Test, TestingModule } from '@nestjs/testing';
import { Unit } from '../units/entities/unit.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

describe('ExercisesController', () => {
  let controller: LessonsController;

  const elements: Lesson[] = [];
  const dto: CreateLessonDto = {
    title: 'Articles',
    exercises: [],
  };

  const newDto: UpdateLessonDto = {
    title: 'Translating exercises',
    exercises: [],
  };

  const lesson: Lesson = new Lesson({
    id: 1,
    title: dto.title,
    exercises: [],
    participations: [],
    unit: new Unit(),
  });

  const newLesson: Lesson = new Lesson({
    id: 1,
    title: newDto.title,
    exercises: [],
    participations: [],
    unit: new Unit(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [LessonsService],
    })
      .overrideProvider(LessonsService)
      .useValue({
        create: jest.fn().mockImplementation((dto: CreateLessonDto) => {
          elements.push(lesson);
          return lesson;
        }),
        findOne: jest.fn().mockImplementation((id) => {
          return elements.find((actualElement) => actualElement.id === id);
        }),
        findOneWithExercises: jest.fn().mockImplementation((id) => {
          return elements.find((actualElement) => actualElement.id === id);
        }),
        findAll: jest.fn().mockImplementation((query) => {
          return elements;
        }),
        update: jest.fn().mockImplementation((id, newDto: UpdateLessonDto) => {
          const index = elements.findIndex(
            (actualElement) => actualElement.id === id,
          );
          elements[index] = {
            id,
            exercises: [],
            unit: new Unit(),
            participations: [],
            title: newDto.title,
          };
          return elements[index];
        }),
        remove: jest.fn().mockImplementation((id) => {
          return elements.find((actualElement) => actualElement.id === id);
        }),
      })
      .compile();

    controller = module.get<LessonsController>(LessonsController);
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Controller create should be defined', () => {
    expect(controller.create).toBeDefined();
  });

  it('Controller create receives createDto correctly', async () => {
    expect(await controller.create(dto)).toEqual(lesson);
  });

  it('Controller find one should be defined', async () => {
    expect(controller.findOne).toBeDefined();
  });

  it('Controller find one returns one element ', async () => {
    expect(await controller.findOne('1')).toEqual(lesson);
  });

  it('Controller find all should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('Controller find all returns an array of elements', async () => {
    const expectedReturn = [lesson];
    expect(await controller.findAll({})).toEqual(expectedReturn);
  });

  it('Controller update should be defined', () => {
    expect(controller.update).toBeDefined();
  });

  it('Controller update should change dto', async () => {
    const expectedReturn = {
      id: 1,
      exercises: [],
      unit: new Unit(),
      participations: [],
      title: newDto.title,
    };
    expect(await controller.update('1', newDto)).toEqual(expectedReturn);
  });

  it('Controller remove should be defined', () => {
    expect(controller.remove).toBeDefined();
  });

  it('Controller remove should delete element', async () => {
    expect(await controller.remove('1')).toEqual(newLesson);
  });
});
