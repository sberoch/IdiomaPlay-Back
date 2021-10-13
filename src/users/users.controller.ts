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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { UserParams } from './dto/user.params';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: UserParams) {
    return this.usersService.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneWithData(+id);
  }

  @ApiOkResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
