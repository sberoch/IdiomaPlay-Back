import { Test, TestingModule } from '@nestjs/testing';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

describe('ExamsController', () => {
  let controller: ExamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsController],
      providers: [ExamsService],
    })
      .overrideProvider(ExamsService)
      .useValue({})
      .compile();

    controller = module.get<ExamsController>(ExamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Controller create should be defined', () => {
    expect(controller.create).toBeDefined();
  });

  it('Controller find one should be defined', () => {
    expect(controller.findOne).toBeDefined();
  });

  it('Controller find one should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('Controller find all should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('Controller find one should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });
});
