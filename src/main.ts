import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from '../swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const baseUrl = configService.get('BASE_URL') || 'http://localhost';

  setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
  console.log(
    `Application is running on: ${baseUrl}:${port}\n`,
    `Visit the API documentation at: ${baseUrl}:${port}/api`,
  );
}

bootstrap().then(() => {
  console.log('Application started successfully');
});
