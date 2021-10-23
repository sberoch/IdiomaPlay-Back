import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { config } from '../common/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserParams } from './dto/user.params';
import { User } from './entities/user.entity';
import { buildQuery } from './users.query-builder';
import { Api } from '../common/api/Api'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(token: string) {
    try {
      const response = await Api.verifyAccessToken(token);
      
      const { email } = response.data
      const user = await this.usersRepository.findOne({ email })
      // Create if user doesn't exist
      if (!user) {
        return this.usersRepository.save(new User({ email }));
      }
    } catch (error) {
      return new BadRequestException(`Token invalido`)
    }
  }

  findAll(params: UserParams) {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<User>(this.usersRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new BadRequestException('No se encontro la leccion');
    return user;
  }

  findOneWithData(id: number) {
    return this.usersRepository.findOne(id, {
      relations: ['challengeParticipation'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async addExamPoints(id: number) {
    console.log('added points');
    const user = await this.findOne(id);
    user.points += config.pointsEarnedByExam;
    await this.usersRepository.save(user);
  }

  async addExercisePoints(id: number) {
    console.log('added epoints');
    const user = await this.findOne(id);
    user.points += config.pointsEarnedByExercise;
    await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    const users = await this.usersRepository.find();
    await this.usersRepository.remove(users);
  }
}
