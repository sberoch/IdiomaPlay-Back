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
import { ParticipationsService } from './participations.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { ParticipationParams } from './dto/participation.params';

@ApiTags('Participations')
@Controller('participations')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}

  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createParticipationDto: CreateParticipationDto) {
    return this.participationsService.create(createParticipationDto);
  }

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: ParticipationParams) {
    if (query.withPassedLessons === 'true') {
      return this.participationsService.findPassedLessons(query);
    }
    return this.participationsService.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participationsService.findOne(+id);
  }

  @ApiOkResponse()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParticipationDto: UpdateParticipationDto,
  ) {
    return this.participationsService.update(+id, updateParticipationDto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participationsService.remove(+id);
  }
}
