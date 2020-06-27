import { NestFactory } from '@nestjs/core';
import * as repl from 'repl';
import { AppModule } from './app.module'

class Repl {
  async run() {
    const applicationContext = await NestFactory.createApplicationContext(
      AppModule,
    );

    const server = repl.start({
      useColors: true,
      prompt: '> ',
      ignoreUndefined: true,
    });
    server.context.app = applicationContext;
  }
}

const session = new Repl();
session.run();
