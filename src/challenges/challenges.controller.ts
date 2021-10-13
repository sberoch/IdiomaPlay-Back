import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeParams } from "./dto/challenge.params";

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly ChallengesService: ChallengesService) {}
  
  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.ChallengesService.create(createChallengeDto);
  }

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: ChallengeParams) {
    return this.ChallengesService.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ChallengesService.findOneWithUnits(+id);
  }

  @ApiOkResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
    return this.ChallengesService.update(+id, updateChallengeDto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ChallengesService.remove(+id);
  }
}
