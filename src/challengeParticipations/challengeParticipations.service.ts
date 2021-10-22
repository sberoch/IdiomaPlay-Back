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
import { Challenge } from '../challenges/entities/challenge.entity';

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

    const user: User = await this.usersService.findOneWithData(userId);

    if (user.challengeParticipation)
      throw new BadRequestException(
        'Usuario ya está participando en una challenge',
      );
    const challenge: Challenge = await this.challengesService.findOne(
      challengeId,
    );

    delete user.challengeParticipation;
    return this.challengeParticipationsRepository.save(
      new ChallengeParticipation({ user, challenge, ...rest }),
    );
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
      const { challenge, user } = challengeParticipation;
      challengeParticipation.isPassed =
        await this.challengesService.isChallengePassedByUser(
          challenge.id,
          user.id,
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

  async removeAll(): Promise<void> {
    const challengeParticipations =
      await this.challengeParticipationsRepository.find();
    await this.challengeParticipationsRepository.remove(
      challengeParticipations,
    );
  }
}
