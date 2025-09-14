import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Office } from './office.entity';
import { Appointment } from './appointment.entity';

export enum MedicalSpecialty {
  GENERAL_MEDICINE = 'general_medicine',
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  NEUROLOGY = 'neurology',
  PEDIATRICS = 'pediatrics',
  GYNECOLOGY = 'gynecology',
  PSYCHIATRY = 'psychiatry',
  ORTHOPEDICS = 'orthopedics',
  OPHTHALMOLOGY = 'ophthalmology',
  DENTISTRY = 'dentistry',
  OTHER = 'other',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: MedicalSpecialty,
    default: MedicalSpecialty.GENERAL_MEDICINE,
  })
  specialty: MedicalSpecialty;

  @Column({ length: 500, nullable: true })
  bio: string;

  @Column({ length: 20, nullable: true })
  licenseNumber: string;

  @Column({ type: 'int', default: 30 })
  consultationDuration: number; // minutes

  @Column({ type: 'int', default: 10 })
  bufferMinutes: number; // buffer between appointments

  @Column({ default: true })
  autoConfirmAppointments: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultationFee: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, user => user.doctorProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Office, office => office.doctor)
  offices: Office[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  constructor(partial: Partial<Doctor>) {
    Object.assign(this, partial);
  }
}