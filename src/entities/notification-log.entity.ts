import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Appointment } from './appointment.entity';

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  IN_APP = 'inapp',
  PUSH = 'push',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
  READ = 'read',
}

export enum NotificationType {
  APPOINTMENT_CREATED = 'appointment_created',
  APPOINTMENT_CONFIRMED = 'appointment_confirmed',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  APPOINTMENT_RESCHEDULED = 'appointment_rescheduled',
  REMINDER_24H = 'reminder_24h',
  REMINDER_1H = 'reminder_1h',
  REMINDER_15MIN = 'reminder_15min',
  APPOINTMENT_COMPLETED = 'appointment_completed',
}

@Entity('notification_logs')
@Index(['appointmentId', 'channel'])
@Index(['status'])
@Index(['type'])
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appointmentId: string;

  @Column('uuid')
  recipientUserId: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
  })
  channel: NotificationChannel;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ length: 100 })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, any>; // Original data sent

  @Column({ type: 'jsonb', nullable: true })
  response: Record<string, any>; // Response from service (Twilio, etc.)

  @Column({ nullable: true })
  externalId: string; // ID from external service

  @Column({ length: 500, nullable: true })
  errorMessage: string;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ nullable: true })
  scheduledFor: Date; // For scheduled notifications

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Appointment, appointment => appointment.notificationLogs)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  constructor(partial: Partial<NotificationLog>) {
    Object.assign(this, partial);
  }
}