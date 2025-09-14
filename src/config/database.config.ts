import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432')),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres123'),
      database: this.configService.get('DB_DATABASE', 'medical_appointments'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      synchronize: this.configService.get('DB_SYNCHRONIZE', 'true') === 'true',
      logging: this.configService.get('DB_LOGGING', 'false') === 'true',
      autoLoadEntities: true,
      retryAttempts: 3,
      retryDelay: 3000,
    };
  }
}