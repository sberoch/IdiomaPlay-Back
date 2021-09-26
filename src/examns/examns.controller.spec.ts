import { Test, TestingModule } from '@nestjs/testing';
import { ExamnsController } from './examns.controller';
import { ExamnsService } from './examns.service';

describe('ExamnsController', () => {
  let controller: ExamnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamnsController],
      providers: [ExamnsService],
    }).compile();

    controller = module.get<ExamnsController>(ExamnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
