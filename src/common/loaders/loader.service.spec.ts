import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from '../../exams/exams.service';
import { ExercisesService } from '../../exercises/exercises.service';
import { LessonsService } from '../../lessons/lessons.service';
import { UnitsService } from '../../units/units.service';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  //TODO: cambiar el overrideProvider del loaderService.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoaderService,
        ExercisesService,
        ExamsService,
        UnitsService,
        LessonsService,
      ],
    })
      .overrideProvider(LoaderService)
      .useValue({})
      .overrideProvider(ExercisesService)
      .useValue({})
      .overrideProvider(ExamsService)
      .useValue({})
      .overrideProvider(UnitsService)
      .useValue({})
      .overrideProvider(LessonsService)
      .useValue({})
      .compile();

    service = module.get<LoaderService>(LoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
