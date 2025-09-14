import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Database configuration
import { DatabaseConfig } from './config/database.config';
import { RedisConfig } from './config/redis.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { OfficesModule } from './modules/offices/offices.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { QueueModule } from './modules/queue/queue.module';

// Configuration
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Redis & Bull Queue
    BullModule.forRootAsync({
      useClass: RedisConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10,  // 10 requests per minute
      },
    ]),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    DoctorsModule,
    OfficesModule,
    SchedulesModule,
    AppointmentsModule,
    NotificationsModule,
    RealtimeModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}