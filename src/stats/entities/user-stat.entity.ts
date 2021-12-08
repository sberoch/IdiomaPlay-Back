import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  userId: number;

  @Column()
  exercisesDone: number;

  constructor(data: Partial<UserStat> = {}, date: Date) {
    this.date = date;
    Object.assign(this, data);
  }
}
