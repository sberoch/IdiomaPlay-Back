import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ChallengeParticipation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.challengeParticipation, {
    eager: true,
  })
  user: User;

  @ManyToOne(() => Challenge, (challenge) => challenge.challengeParticipations, {
    eager: true,
  })
  challenge: Challenge;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public get isPassed(): boolean {
    return this.challenge.isPassedByUser(this.user.id);
  }

  constructor(data: Partial<ChallengeParticipation> = {}) {
    Object.assign(this, data);
  }
}
