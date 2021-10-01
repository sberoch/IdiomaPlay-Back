import { config } from '../../common/config';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exam } from '../../exams/entities/exam.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Unit } from '../../units/entities/unit.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalExercises: number;

  @Column({ default: 0 })
  correctExercises: number;

  @ManyToOne(() => User, (user) => user.participations, { eager: true })
  user: User;

  @ManyToOne(() => Unit, (unit) => unit.participations, {
    eager: true,
  })
  unit: Unit;

  @ManyToOne(() => Exam, (exam) => exam.participations, {
    nullable: true,
    eager: true,
  })
  exam: Exam;

  @ManyToOne(() => Lesson, (lesson) => lesson.participations, {
    nullable: true,
    eager: true,
  })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public get isPassed(): boolean {
    return this.correctExercises / (this.totalExercises * 1.0) >= config.passingPercentage;
  }

  constructor(data: Partial<Participation> = {}) {
    Object.assign(this, data);
  }
}
