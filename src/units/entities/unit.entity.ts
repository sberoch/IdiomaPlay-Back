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

  constructor(data: Partial<Unit> = {}) {
    Object.assign(this, data);
  }
}
