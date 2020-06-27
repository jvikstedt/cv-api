import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from 'config';
import {
  CONFIG_SERVER,
  CONFIG_SERVER_PORT,
} from './constants';

async function bootstrap() {
  const serverConfig = config.get(CONFIG_SERVER);
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('CV')
    .setDescription('The CV API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks();

  const port = process.env.PORT || serverConfig[CONFIG_SERVER_PORT];
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
