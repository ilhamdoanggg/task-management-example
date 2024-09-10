import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TaskStatus } from './task.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
