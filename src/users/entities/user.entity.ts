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
import { config } from '../../common/config';

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
  )
  @JoinColumn()
  challengeParticipation: ChallengeParticipation;

  @Column()
  points: number;

  @Column({ default: config.roles.common })
  role: string;

  @Column({ default: null })
  password: string;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
    this.points = 0;
  }
}
