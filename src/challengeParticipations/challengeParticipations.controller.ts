import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { ChallengeParticipationService } from './challengeParticipations.service';
import { ChallengeParticipationParams } from './dto/challengeParticipation.params';
import { CreateChallengeParticipationDto } from './dto/create-challengeParticipation.dto';

@ApiTags('ChallengeParticipations')
@Controller('challengeParticipations')
export class ChallengeParticipationController {
  constructor(private readonly challengeParticipationService: ChallengeParticipationService) {}

  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createChallengeParticipationDto: CreateChallengeParticipationDto) {
    return this.challengeParticipationService.create(createChallengeParticipationDto);
  }

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: ChallengeParticipationParams) {
    return this.challengeParticipationService.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengeParticipationService.findOne(+id);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengeParticipationService.remove(+id);
  }

  @ApiOkResponse()
  @Delete(':userId/completeParticipation')
  removeByUserId(@Param('userId') userId: string) {
    return this.challengeParticipationService.removeByUserId(+userId);
  }
}
