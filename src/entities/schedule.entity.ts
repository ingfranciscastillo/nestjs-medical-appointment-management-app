import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Office } from './office.entity';

export enum WeekDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

@Entity('schedules')
@Index(['officeId', 'weekday'])
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  officeId: string;

  @Column({
    type: 'int',
    comment: '0=Sunday, 1=Monday, ..., 6=Saturday',
  })
  weekday: WeekDay;

  @Column({ type: 'time' })
  startTime: string; // Format: "09:00"

  @Column({ type: 'time' })
  endTime: string; // Format: "17:00"

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 200, nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Office, office => office.schedules)
  @JoinColumn({ name: 'officeId' })
  office: Office;

  constructor(partial: Partial<Schedule>) {
    Object.assign(this, partial);
  }
}