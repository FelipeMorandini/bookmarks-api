import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from '../swagger';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { LoggerService } from './logger/logger.service';

/**
 * Boots up and initializes the application server.
 *
 * This method creates a new NestJS application instance, configures global pipes for validation,
 * sets up Swagger documentation for the API, and starts listening on the specified port.
 * The server's base URL and port are retrieved from the configuration service, with default
 * values provided if not set.
 *
 * @return {Promise<void>} A promise that resolves when the application is successfully started and listening for requests.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  const port = configService.get('PORT') || 3000;
  const baseUrl = configService.get('BASE_URL') || 'http://localhost';

  setupSwagger(app);

  app.useGlobalInterceptors(new ErrorInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
  logger.log(
    `Application is running on: ${baseUrl}:${port}\nVisit the API documentation at: ${baseUrl}:${port}/api`,
    'Bootstrap',
  );
}

bootstrap().then(() => {
  const logger = new LoggerService();
  logger.log('Application started successfully', 'Bootstrap');
});
