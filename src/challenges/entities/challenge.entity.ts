import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Unit } from '../../units/entities/unit.entity';
import { ChallengeParticipation } from '../../challengeParticipations/entities/challengeParticipation.entity';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Test challenge' })
  title: string;

  @OneToMany(() => Unit, (unit) => unit.challenge, {
    cascade: true,
  })
  units: Unit[];

  @OneToMany(
    () => ChallengeParticipation,
    (challengeParticipation) => challengeParticipation.challenge,
    {
      cascade: true,
    },
  )
  challengeParticipations: ChallengeParticipation[];

  constructor(data: Partial<Challenge> = {}) {
    Object.assign(this, data);
  }
}
