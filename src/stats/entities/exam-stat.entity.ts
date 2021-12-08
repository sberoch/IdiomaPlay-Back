import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ExamStat {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  examTime: number;

  @Column()
  passed: boolean;

  constructor(data: Partial<ExamStat> = {}) {
    Object.assign(this, data);
  }
}
