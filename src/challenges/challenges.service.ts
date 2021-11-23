import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { buildQuery } from './challenges.query-builder';
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
    const { units, ...rest } = createChallengeDto;
    const createdUnits: Unit[] = [];
    const challenge = new Challenge({ ...rest });
    for (const unit of units) {
      const createdUnit = await this.unitsService.create(unit);
      createdUnits.push(createdUnit);
    }
    challenge.units = createdUnits;
    return await this.challengeRepository.save(challenge);
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
    if (!challenge)
      throw new BadRequestException('No se encontro el challenge');
    return challenge;
  }

  async findOneWithUnits(id: number) {
    return this.challengeRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id: id })
      .leftJoinAndSelect('c.units', 'units')
      .getOne();
  }

  async update(id: number, updateChallengeDto: UpdateChallengeDto) {
    const challenge = await this.challengeRepository.findOne(id);
    const upsertedUnits: Unit[] = [];
    for (const unit of updateChallengeDto.units) {
      const updated = await this.unitsService.upsert(challenge, unit);
      upsertedUnits.push(updated);
    }
    Object.assign(challenge, updateChallengeDto);
    challenge.units = upsertedUnits;
    return this.challengeRepository.save(challenge);
  }

  async isChallengePassedByUser(
    challengeId: number,
    userId: number,
  ): Promise<boolean> {
    const challenge = await this.findOneWithUnits(challengeId);
    for (const unit of challenge.units) {
      const isUnitPassedByUser = await this.unitsService.isUnitPassedByUser(
        unit.id,
        userId,
      );
      if (!isUnitPassedByUser) {
        return false;
      }
    }
    return true;
  }

  async enableOrDisable(id: number) {
    const challenge = await this.challengeRepository.findOne(id);
    challenge.enabled = !challenge.enabled;
    return this.challengeRepository.save(challenge);
  }

  async remove(id: number) {
    const removed = await this.challengeRepository.findOne(id);
    await this.challengeRepository.delete(id);
    return removed;
  }

  async removeAll(): Promise<void> {
    const units = await this.challengeRepository.find();
    await this.challengeRepository.remove(units);
  }
}
