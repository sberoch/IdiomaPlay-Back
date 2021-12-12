import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UnitStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  dailyPassedUnits: number;

  constructor(data: Partial<UnitStat> = {}, date: Date) {
    Object.assign(this, data);
    this.date = date;
  }
}
