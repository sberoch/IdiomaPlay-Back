import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from '../../exams/entities/exam.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Participation } from '../../participations/entities/participation.entity';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Test Unit' })
  title: string;

  @OneToMany(() => Lesson, (lesson) => lesson.unit, { cascade: true })
  lessons: Lesson[];

  @OneToOne(() => Exam, (exam) => exam.unit)
  @JoinColumn()
  exam: Exam;

  @OneToMany(() => Participation, (participation) => participation.unit)
  participations: Participation[];

  constructor(data: Partial<Unit> = {}) {
    Object.assign(this, data);
  }
}
