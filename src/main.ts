import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config"
import helmet from "helmet"

import { AppModule } from './app.module';

async function bootstrap() {

  const logger = new Logger("Bootstrap")

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        scriptSrc: [`'self'`],
        manifestSrc: [`'self'`],
        frameSrc: [`'self'`],
      }
    }
  }));

  app.enableCors({
    origin: configService.get('WEBSOCKET_CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Medical Appointments API')
      .setDescription('Sistema de gestión de turnos médicos')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`📚 Swagger documentation: http://localhost:${configService.get('PORT', 3000)}/${apiPrefix}/docs`);
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`🔥 Environment: ${configService.get('NODE_ENV', 'development')}`);

}
bootstrap();
