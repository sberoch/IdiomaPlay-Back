import { Test, TestingModule } from '@nestjs/testing';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

describe('ExercisesController', () => {
  let controller: ExercisesController;

  let elements: Exercise[] = [];
  const dto: CreateExerciseDto = {
    title: "Articles",
    type: "complete" as ExerciseType,
    sentence: "I like * blue T-shirt over there.", 
    options: [
        "as",
        "an",
        "the",
        "this"
    ],
    correctOption: "the"
  }

  const newDto: UpdateExerciseDto = {
    title: "Articulos",
    type: "complete" as ExerciseType,
    sentence: "I like * blue T-shirt over there.", 
    options: [
        "as",
        "an",
        "the",
        "this"
    ],
    correctOption: "the"
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesController],
      providers: [ExercisesService],
    })
      .overrideProvider(ExercisesService)
      .useValue({
        create: jest.fn().mockImplementation( (dto) => {
          const exercise: Exercise = { id:1, ...dto}
          elements.push(exercise)
          return exercise;
        }),
        findOne: jest.fn().mockImplementation( (id = 1) => {
          return elements.find(actualElement => actualElement.id === id)
        }),
        findAll: jest.fn().mockImplementation( (obj) => {
          return elements
        }),
        update: jest.fn().mockImplementation( (id, dto) => {
          const index = elements.findIndex(actualElement => actualElement.id === id);
          elements[index] = { id, ...dto}
          return elements[index]
        }),
        remove: jest.fn().mockImplementation( (id) => {
          return elements.find(actualElement => actualElement.id === id)
        })  
      })
      .compile();

    controller = module.get<ExercisesController>(ExercisesController);
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Controller create should be defined', () => {
    expect(controller.create).toBeDefined();
  });

  it('Controller create receives createDto correctly', async () => {
    const expectedReturn = { id: 1, ...dto}
    expect(await controller.create(dto)).toEqual(expectedReturn);
  });

  it('Controller find one should be defined', async () => {
    expect(controller.findOne).toBeDefined();
  });

  it('Controller find one returns one element ', async () => {
    const expectedReturn = { id: 1, ...dto}
    expect(await controller.findOne("1")).toEqual(expectedReturn);
  });

  it('Controller find all should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('Controller find all returns an array of elements', async () => {
    const expectedReturn = [{ id: 1, ...dto }]
    expect(await controller.findAll({})).toEqual(expectedReturn);
  });

  it('Controller update should be defined', () => {
    expect(controller.update).toBeDefined();
  });

  it('Controller update should change dto', async () => {
    const expectedReturn = { id:1, ...newDto}
    expect(await controller.update("1", newDto)).toEqual(expectedReturn);
  });

  it('Controller remove should be defined', () => {
    expect(controller.remove).toBeDefined();
  });

  it('Controller remove should delete element', async () => {
    const expectedReturn = { id: 1, ...newDto}
    expect(await controller.remove("1")).toEqual(expectedReturn);
  });
});
