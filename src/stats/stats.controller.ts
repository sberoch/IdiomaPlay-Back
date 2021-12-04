import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  @Get('/daily-active-users')
  getDailyActiveUsers(@Query() query: StatsParams) {
    return this.statsService.getDailyActiveUsers(query);
  }

  @ApiOkResponse()
  @Get('/daily-completed-units')
  getDailyCompletedUnits(@Query() query: StatsParams) {
    return this.statsService.getDailyCompletedUnits(query);
  }

  @ApiOkResponse()
  @Get('/access-frecuency')
  getAccessFrecuency(@Query() query: StatsParams) {
    return this.statsService.getAccessFrecuency(query);
  }
}
