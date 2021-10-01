import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Participation } from '../../participations/entities/participation.entity';
import { Unit } from '../../units/entities/unit.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Test lesson' })
  title: string;

  @ManyToMany(() => Exercise, (exercise) => exercise.lesson, { cascade: true })
  @JoinTable()
  exercises: Exercise[];

  @OneToMany(() => Participation, (participation) => participation.lesson, {
    cascade: true,
  })
  participations: Participation[];

  @ManyToOne(() => Unit, (unit) => unit.lessons)
  unit: Unit;

  constructor(data: Partial<Lesson> = {}) {
    Object.assign(this, data);
  }
}
