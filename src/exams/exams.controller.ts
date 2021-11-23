import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Query,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { ExamParams } from './dto/exam.params';

@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: ExamParams) {
    return this.examsService.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOneWithExercises(+id);
  }

  @ApiOkResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(+id, updateExamDto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examsService.remove(+id);
  }
}
