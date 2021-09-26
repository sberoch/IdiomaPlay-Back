import { Test, TestingModule } from '@nestjs/testing';
import { ExamnsService } from './examns.service';

describe('ExamnsService', () => {
  let service: ExamnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamnsService],
    }).compile();

    service = module.get<ExamnsService>(ExamnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
