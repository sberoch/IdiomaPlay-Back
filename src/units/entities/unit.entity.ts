import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Examn } from '../../examns/entities/examn.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@Entity()
export class Unit {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ default: 'Test Unit' })
    title: string;
  
    @OneToMany( () => Lesson, (lesson) => lesson.unit, { cascade:true })
    lessons: Lesson[]; 

    @OneToOne( () => Examn, (examn) => examn.unit)
    @JoinColumn()
    examn: Examn;
    
    constructor(data: Partial<Unit> = {}) {
      Object.assign(this, data);
    }
}
