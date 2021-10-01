import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participation } from '../../participations/entities/participation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[];

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }
}
