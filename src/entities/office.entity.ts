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
import { Doctor } from './doctor.entity';
import { Schedule } from './schedule.entity';
import { Exception } from './exception.entity';
import { Appointment } from './appointment.entity';

@Entity('offices')
@Index(['doctorId'])
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  doctorId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 50, default: 'America/New_York' })
  timezone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  coordinates: {
    latitude: number;
    longitude: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  facilities: string[]; // ['parking', 'wheelchair_access', 'wifi']

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Doctor, doctor => doctor.offices)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @OneToMany(() => Schedule, schedule => schedule.office)
  schedules: Schedule[];

  @OneToMany(() => Exception, exception => exception.office)
  exceptions: Exception[];

  @OneToMany(() => Appointment, appointment => appointment.office)
  appointments: Appointment[];

  constructor(partial: Partial<Office>) {
    Object.assign(this, partial);
  }
}