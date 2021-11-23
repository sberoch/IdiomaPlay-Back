import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';

describe('ParticipationsController', () => {
  let controller: ParticipationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationsController],
      providers: [ParticipationsService],
    })
      .overrideProvider(ParticipationsService)
      .useValue({})
      .compile();

    controller = module.get<ParticipationsController>(ParticipationsController);
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
