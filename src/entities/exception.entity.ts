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

export enum ExceptionType {
  BLOCKED = 'blocked',    // No appointments allowed
  SPECIAL = 'special',    // Special hours
  HOLIDAY = 'holiday',    // Holiday closure
  VACATION = 'vacation',  // Doctor vacation
  EMERGENCY = 'emergency', // Emergency closure
}

@Entity('exceptions')
@Index(['officeId', 'date'])
export class Exception {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  officeId: string;

  @Column({ type: 'date' })
  date: string; // Format: "2024-12-25"

  @Column({ type: 'time', nullable: true })
  startTime: string; // Format: "09:00"

  @Column({ type: 'time', nullable: true })
  endTime: string; // Format: "17:00"

  @Column({
    type: 'enum',
    enum: ExceptionType,
    default: ExceptionType.BLOCKED,
  })
  type: ExceptionType;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Office, office => office.exceptions)
  @JoinColumn({ name: 'officeId' })
  office: Office;

  constructor(partial: Partial<Exception>) {
    Object.assign(this, partial);
  }
}