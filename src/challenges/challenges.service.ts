import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { buildQuery } from '../exercises/exercises.query-builder';
import { Unit } from '../units/entities/unit.entity';
import { UnitsService } from '../units/units.service';
import { ChallengeParams } from './dto/challenge.params';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
    private unitsService: UnitsService,
  ) {}

  async create(createChallengeDto: CreateChallengeDto) {
    const { unitsIds, ...rest } = createChallengeDto;
    const units: Unit[] = [];

    for (const unitId of unitsIds) {
      const unit: Unit = await this.unitsService.findOne(unitId);
      units.push(unit);
    }

    return this.challengeRepository.save(new Challenge({ units, ...rest}));
  }

  findAll(params: ChallengeParams): Promise<Pagination<Challenge>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<Challenge>(this.challengeRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number) {
    const challenge = await this.challengeRepository.findOne(id);
    if (!challenge) throw new BadRequestException('No se encontro el challenge');
    return challenge;
  }

  findOneWithUnits(id: number) {
    return this.challengeRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id: id })
      .leftJoinAndSelect('c.units', 'units')
      .getOne();
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return this.challengeRepository.update(id, updateChallengeDto);
  }

  async remove(id: number): Promise<void> {
    await this.challengeRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    const units = await this.challengeRepository.find();
    await this.challengeRepository.remove(units);
  }
}


