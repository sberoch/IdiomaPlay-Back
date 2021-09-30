import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exam } from '../../exams/entities/exam.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (unit) => unit.participations, { eager: true })
  user: User;

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

  constructor(data: Partial<Participation> = {}) {
    Object.assign(this, data);
  }
}
