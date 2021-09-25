import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'TestLesson' })
  title: string;

  @ManyToMany( () => Exercise, (exercise) => exercise.lesson, { cascade:true })
  @JoinTable()
  exercises: Exercise[];
  
  constructor(data: Partial<Lesson> = {}) {
    Object.assign(this, data);
  }
}