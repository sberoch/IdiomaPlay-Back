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
import { Participation } from '../../participations/entities/participation.entity';
import { Unit } from '../../units/entities/unit.entity';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Test Exam' })
  title: string;

  @Column()
  examTimeInSeconds: number;

  @ManyToMany(() => Exercise, (exercise) => exercise.exam, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  exercises: Exercise[];

  @OneToMany(() => Participation, (participation) => participation.exam, {
    cascade: true,
  })
  participations: Participation[];

  @OneToOne(() => Unit, (unit) => unit.exam, { onDelete: 'SET NULL' })
  unit: Unit;

  constructor(data: Partial<Exam> = {}) {
    Object.assign(this, data);
  }
}
