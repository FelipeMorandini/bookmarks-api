import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures and sets up Swagger for the given NestJS application instance.
 *
 * @param {INestApplication} app - The NestJS application instance to which Swagger will be applied.
 * @return {void} This function does not return a value.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Bookmarks API')
    .setDescription('API for managing bookmarks')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
