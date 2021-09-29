import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (unit) => unit.participations, { eager: true })
  user: User;

  constructor(data: Partial<Participation> = {}) {
    Object.assign(this, data);
  }
}
