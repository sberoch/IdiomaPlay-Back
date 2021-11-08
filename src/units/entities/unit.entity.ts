import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Participation } from '../../participations/entities/participation.entity';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Test Unit' })
  title: string;

  @OneToMany(() => Lesson, (lesson) => lesson.unit, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  lessons: Lesson[];

  @OneToOne(() => Exam, (exam) => exam.unit, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  exam: Exam;

  @OneToMany(() => Participation, (participation) => participation.unit)
  participations: Participation[];

  @ManyToOne(() => Challenge, (challenge) => challenge.units, {
    eager: true,
    onDelete: 'SET NULL',
  })
  challenge: Challenge;

  constructor(data: Partial<Unit> = {}) {
    Object.assign(this, data);
  }
}
