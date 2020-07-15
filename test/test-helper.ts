import * as R from 'ramda';
import { useSeeding } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { INestApplication, ValidationPipe, BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from "@nestjs/jwt";
import { User } from "../src/users/user.entity";
import { JwtPayload } from "../src/auth/jwt-payload.interface";
import { AppModule } from '../src/app.module';

export class TestHelper {
  public accessToken = '';
  public app: INestApplication;
  public connection: Connection;
  public jwtService: JwtService;

  public async setup() {
    this.accessToken = '';

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    this.app = module.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }));
    await this.app.init();

    this.connection = module.get<Connection>(Connection);
    this.jwtService = module.get<JwtService>(JwtService);

    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  }

  public sign(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      cvIds: [user.cv.id],
      templateIds: R.map(t => t.id, user.templates),
    };
    this.accessToken = this.jwtService.sign(payload);
    return this.accessToken;
  }

  public async resetDb(): Promise<void> {
    await this.connection.synchronize(true);
  }

  public async close(): Promise<void> {
    await this.app.close();
  }
}
