import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Medical Appointments API is running successfully! 🏥',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  getHealth(): any {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'connected', // TODO: Add real health check
        redis: 'connected',     // TODO: Add real health check
        notifications: 'active',
      },
    };
  }
}