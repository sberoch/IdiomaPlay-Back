import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity()
export class Examn {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ default: 'Test Examn' })
    title: string;
  
    @ManyToMany( () => Exercise, (exercise) => exercise.lesson, { cascade:true })
    @JoinTable()
    exercises: Exercise[];
    
    constructor(data: Partial<Examn> = {}) {
      Object.assign(this, data);
    }
}
