import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Test' })
  name: string;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }
}
