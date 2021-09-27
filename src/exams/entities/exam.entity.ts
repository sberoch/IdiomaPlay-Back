import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Unit } from '../../units/entities/unit.entity';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Test Exam' })
  title: string;

  @ManyToMany(() => Exercise, (exercise) => exercise.lesson, { cascade: true })
  @JoinTable()
  exercises: Exercise[];

  @OneToOne(() => Unit, (unit) => unit.exam)
  unit: Unit;

  constructor(data: Partial<Exam> = {}) {
    Object.assign(this, data);
  }
}
