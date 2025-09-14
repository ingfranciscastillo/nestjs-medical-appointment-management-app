import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';

@Injectable()
export class RedisConfig implements BullOptionsFactory {
  constructor(private configService: ConfigService) {}

  createBullOptions(): BullModuleOptions {
    return {
      redis: {
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: parseInt(this.configService.get('REDIS_PORT', '6379')),
        password: this.configService.get('REDIS_PASSWORD'),
        enableReadyCheck: false,
        lazyConnect: true,
        maxRetriesPerRequest: 3,
      },
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    };
  }
}