import {
  Column,
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

  @Column()
  userId: number;

  @ManyToOne(
    () => Challenge,
    (challenge) => challenge.challengeParticipations,
    {
      eager: true,
      onDelete: 'SET NULL',
    },
  )
  challenge: Challenge;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isPassed: boolean;

  constructor(data: Partial<ChallengeParticipation> = {}) {
    Object.assign(this, data);
  }
}
