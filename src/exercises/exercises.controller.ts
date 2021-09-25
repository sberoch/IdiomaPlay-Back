import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseParams } from './dto/exercise.params';
import { UpdateExerciseDto } from './dto/update-exercise.dto';


@ApiTags('Exercises')
@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService){}

    @ApiCreatedResponse()
    @Post()
    create(@Body() createExerciseDto: CreateExerciseDto) {
      return this.exercisesService.create(createExerciseDto);
    }
  
    @ApiOkResponse()
    @Get()
    findAll(@Query() query: ExerciseParams) {
      return this.exercisesService.findAll(query);
    }
  
    @ApiOkResponse()
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.exercisesService.findOne(+id);
    }
  
    @ApiOkResponse()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
      return this.exercisesService.update(+id, updateExerciseDto);
    }
  
    @ApiOkResponse()
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.exercisesService.remove(+id);
    }
}
