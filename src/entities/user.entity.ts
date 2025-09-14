import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Doctor } from './doctor.entity';
import { Appointment } from './appointment.entity';

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  RECEPTIONIST = 'receptionist',
}

export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    inApp: boolean;
  };
  timezone?: string;
  language?: string;
  theme?: 'light' | 'dark';
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: UserSettings;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ nullable: true })
  phoneVerifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Doctor, doctor => doctor.user)
  doctorProfile: Doctor;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  patientAppointments: Appointment[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}