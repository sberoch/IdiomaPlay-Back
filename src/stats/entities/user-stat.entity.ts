import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  createdDate: Date;

  @Column()
  userId: number;

  @Column()
  exercisesDone: number;

  constructor(data: Partial<UserStat> = {}) {
    this.createdDate = new Date(new Date().setHours(0, 0, 0, 0));
    // this.createdDate = new Date('12/4/20');
    Object.assign(this, data);
  }
}
