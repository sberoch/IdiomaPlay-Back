import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ default: 'Test' })
  title: string;

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

  @ManyToMany(() => Lesson, (lesson) => lesson.exercises)
  lesson: Lesson[];

  constructor(data: Partial<Exercise> = {}) {
    Object.assign(this, data);
  }
}
