import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChallengeParticipation } from '../../challengeParticipations/entities/challengeParticipation.entity';
import { Participation } from '../../participations/entities/participation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[];

  @OneToOne(
    () => ChallengeParticipation,
    (challengeParticipation) => challengeParticipation.user,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  challengeParticipation: ChallengeParticipation;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }
}
