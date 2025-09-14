import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Doctor } from './doctor.entity';
import { Office } from './office.entity';
import { NotificationLog } from './notification-log.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum CancellationReason {
  PATIENT_REQUEST = 'patient_request',
  DOCTOR_UNAVAILABLE = 'doctor_unavailable',
  EMERGENCY = 'emergency',
  ILLNESS = 'illness',
  SCHEDULE_CONFLICT = 'schedule_conflict',
  OTHER = 'other',
}

@Entity('appointments')
@Index(['doctorId', 'startAt'])
@Index(['patientId', 'startAt'])
@Index(['officeId', 'startAt'])
@Index(['status'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  doctorId: string;

  @Column('uuid')
  officeId: string;

  @Column('uuid')
  patientId: string;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  endAt: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ length: 500, nullable: true })
  notes: string;

  @Column({ length: 500, nullable: true })
  patientNotes: string;

  @Column({ length: 500, nullable: true })
  doctorNotes: string;

  @Column({
    type: 'enum',
    enum: CancellationReason,
    nullable: true,
  })
  cancellationReason: CancellationReason;

  @Column({ length: 200, nullable: true })
  cancellationNote: string;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelledByUserId: string;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Additional data

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @ManyToOne(() => Office, office => office.appointments)
  @JoinColumn({ name: 'officeId' })
  office: Office;

  @ManyToOne(() => User, user => user.patientAppointments)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @OneToMany(() => NotificationLog, log => log.appointment)
  notificationLogs: NotificationLog[];

  constructor(partial: Partial<Appointment>) {
    Object.assign(this, partial);
  }
}