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

  constructor(data: Partial<UserStat> = {}, date: Date) {
    this.createdDate = date;
    Object.assign(this, data);
  }
}
