import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from '../../exams/entities/exam.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

export enum ExerciseType {
  LISTEN = 'listen',
  COMPLETE = 'complete',
  TRANSLATE_OLD_TO_NEW = 'translate_old_to_new',
  TRANSLATE_NEW_TO_OLD = 'translate_new_to_old',
}

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Tests' })
  title: string;

  @Column()
  sentence: string;

  @Column({
    type: 'enum',
    enum: ExerciseType,
    default: ExerciseType.COMPLETE,
  })
  type: ExerciseType;

  @Column('text', { array: true })
  options: string[];

  @Column()
  correctOption: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.exercises, {
    onDelete: 'SET NULL',
  })
  lesson: Lesson;

  @ManyToMany(() => Exam, (exam) => exam.exercises)
  exam: Exam[];

  constructor(data: Partial<Exercise> = {}) {
    Object.assign(this, data);
  }
}
