import { ModuleRef, NestFactory, Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AppModule } from './app.module';
import { CONFIG_SERVER, CONFIG_SERVER_PORT } from './constants';
import { MyAuthGuard } from './auth/auth.guard';
import { AuthorizationGuard } from './authorization/authorization.guard';
import * as config from 'config';

@Injectable()
export class DryRunInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const dry = request.query.dry === 'true';

    if (dry) {
      return;
    }

    return next.handle();
  }
}

async function bootstrap(): Promise<void> {
  const serverConfig = config.get(CONFIG_SERVER);
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const reflector = app.get(Reflector);
  const moduleRef = app.get(ModuleRef);
  app.useGlobalGuards(new MyAuthGuard(reflector));
  app.useGlobalGuards(new AuthorizationGuard(reflector, moduleRef));
  app.useGlobalInterceptors(new DryRunInterceptor());

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
