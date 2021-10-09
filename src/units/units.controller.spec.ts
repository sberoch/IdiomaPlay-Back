import { Test, TestingModule } from '@nestjs/testing';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

describe('UnitsController', () => {
  let controller: UnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitsController],
      providers: [UnitsService],
    })
      .overrideProvider(UnitsService)
      .useValue({})
      .compile();

    controller = module.get<UnitsController>(UnitsController);
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
