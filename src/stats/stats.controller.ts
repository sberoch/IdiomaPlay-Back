import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { CreateUserStatDto } from './dto/create-user-stat.dto';
import { StatsParams } from './dto/stats.params';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiOkResponse()
  @Get('/mean-time-exams')
  getMeanTimeForExams(@Query() query: StatsParams) {
    return this.statsService.getMeanTimeForExams(query);
  }

  @ApiOkResponse()
  @Get('/passed-exams')
  getPassedAndFailedExamsCount(@Query() query: StatsParams) {
    return this.statsService.getPassedAndFailedExamsCount(query);
  }

  @ApiOkResponse()
  @Get('/daily-active-users')
  getDailyActiveUsers(@Query() query: StatsParams): any {
    return this.statsService.getDailyActiveUsers(query);
  }

  @ApiOkResponse()
  @Get('/daily-completed-units')
  getDailyCompletedUnits(@Query() query: StatsParams) {
    return this.statsService.getDailyCompletedUnits(query);
  }

  @ApiOkResponse()
  @ApiOperation({
    summary: 'Devuelve el ultimo login de cada usuario con su categoria',
  })
  @Get('/access-frecuency')
  getAccessFrecuency(): any {
    return this.statsService.getAccessFrecuency();
  }

  //TODO: remove
  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createUserStatDto: CreateUserStatDto) {
    return this.statsService.createUserStat(createUserStatDto, null);
  }

  @ApiOkResponse()
  @Get('/userStats')
  findAllUserStats() {
    return this.statsService.findAllUserStats();
  }

  @ApiOkResponse()
  @Get('/unitStats')
  findAllUnitStats() {
    return this.statsService.findAllUnitStats();
  }

  //TODO: remove
  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statsService.remove(+id);
  }
}
