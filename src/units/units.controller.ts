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

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitParams } from './dto/unit.params';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitsService } from './units.service';

@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: UnitParams) {
    return this.unitsService.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitsService.findOneWithLessonsAndExam(+id);
  }

  @ApiOkResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(+id, updateUnitDto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(+id);
  }
}
