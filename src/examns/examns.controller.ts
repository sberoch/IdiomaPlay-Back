import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Query } from '@nestjs/common';
import { ExamnsService } from './examns.service';
import { CreateExamnDto } from './dto/create-examn.dto';
import { UpdateExamnDto } from './dto/update-examn.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { ExamnParams } from './dto/examn.params';

@ApiTags('Examns')
@Controller('examns')
export class ExamnsController {
  constructor(private readonly examnsService: ExamnsService) {}

  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createExamnDto: CreateExamnDto) {
    return this.examnsService.create(createExamnDto);
  }

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: ExamnParams) {
    return this.examnsService.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examnsService.findOne(+id);
  }

  @ApiOkResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamnDto: UpdateExamnDto) {
    return this.examnsService.update(+id, updateExamnDto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examnsService.remove(+id);
  }
}
