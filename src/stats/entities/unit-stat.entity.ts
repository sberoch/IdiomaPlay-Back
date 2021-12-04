import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UnitStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  dailyPassedUnits: number;

  constructor(data: Partial<UnitStat> = {}) {
    Object.assign(this, data);
  }
}
