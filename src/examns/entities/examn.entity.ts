import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Unit } from '../../units/entities/unit.entity';

@Entity()
export class Examn {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ default: 'Test Examn' })
    title: string;
  
    @ManyToMany( () => Exercise, (exercise) => exercise.lesson, { cascade:true })
    @JoinTable()
    exercises: Exercise[];

    @OneToOne( () => Unit, (unit) => unit.examn)
    unit: Unit;
    
    constructor(data: Partial<Examn> = {}) {
      Object.assign(this, data);
    }
}
