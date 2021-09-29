import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }
}
