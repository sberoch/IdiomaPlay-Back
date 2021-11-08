import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateChallengeParticipationDto } from './dto/create-challengeParticipation.dto';
import { ChallengeParticipation } from './entities/challengeParticipation.entity';
import { buildQuery } from './challengeParticipations.query-builder';
import { ChallengeParticipationParams } from './dto/challengeParticipation.params';
import { UsersService } from '../users/users.service';
import { ChallengesService } from '../challenges/challenges.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChallengeParticipationService {
  constructor(
    @InjectRepository(ChallengeParticipation)
    private challengeParticipationsRepository: Repository<ChallengeParticipation>,
    private usersService: UsersService,
    private challengesService: ChallengesService,
  ) {}

  async create(createChallengeParticipation: CreateChallengeParticipationDto) {
    const { userId, challengeId, ...rest } = createChallengeParticipation;
    const user = await this.usersService.findOneWithData(userId);

    if (!user.challengeParticipation.isPassed)
      throw new BadRequestException(
        'Usuario ya está participando en una challenge',
      );
    const challenge = await this.challengesService.findOne(challengeId);

    delete user.challengeParticipation;
    return this.challengeParticipationsRepository.save(
      new ChallengeParticipation({ user, challenge, userId, ...rest }),
    );
  }

  async createIfNotExists(userId: number, challengeId: number) {
    const user = await this.usersService.findOneWithData(userId);
    const challenge = await this.challengesService.findOne(challengeId);
    const prev = await this.challengeParticipationsRepository
      .createQueryBuilder('cp')
      .leftJoinAndSelect('cp.user', 'user')
      .leftJoinAndSelect('cp.challenge', 'challenge')
      .where('user.id = :userId', { userId })
      .where('challenge.id = :challengeId', { challengeId })
      .getOne();

    if (!prev) {
      await this.challengeParticipationsRepository.save(
        new ChallengeParticipation({ user, userId, challenge }),
      );
    }
  }

  async findAll(params: ChallengeParticipationParams) {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    const result = await paginate<ChallengeParticipation>(
      this.challengeParticipationsRepository,
      paginationOptions,
      {
        where: findOptions,
        order: orderOptions,
      },
    );

    const challengeParticipations = result.items;
    for (const challengeParticipation of challengeParticipations) {
      const { challenge, userId } = challengeParticipation;
      challengeParticipation.isPassed =
        await this.challengesService.isChallengePassedByUser(
          challenge.id,
          userId,
        );
    }
    return { items: challengeParticipations, meta: result.meta };
  }

  async findOne(id: number) {
    const challengeParticipation =
      await this.challengeParticipationsRepository.findOne(id);
    if (!challengeParticipation)
      throw new BadRequestException(
        'No se encontro la challenge participation',
      );
    return challengeParticipation;
  }

  async remove(id: number): Promise<void> {
    await this.challengeParticipationsRepository.delete(id);
  }

  async removeByUserId(userId: number): Promise<void> {
    const user = await this.usersService.findOneWithData(userId);
    if (!user) throw new BadRequestException('El usuario no existe');
    await this.usersService.update(userId, { challengeParticipation: null });
  }

  async removeIfCompleted(user: User, challengeId: number) {
    if (
      await this.challengesService.isChallengePassedByUser(challengeId, user.id)
    ) {
      await this.usersService.addChallengePoints(user.id);
      await this.challengeParticipationsRepository.update(
        user.challengeParticipation.id,
        { isPassed: true },
      );
    }
  }

  async removeAll(): Promise<void> {
    const challengeParticipations =
      await this.challengeParticipationsRepository.find();
    await this.challengeParticipationsRepository.remove(
      challengeParticipations,
    );
  }
}
