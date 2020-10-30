import * as R from 'ramda';
import { useSeeding } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { User } from '../src/users/user.entity';
import { JwtPayload } from '../src/auth/jwt-payload.interface';
import { AppModule } from '../src/app.module';
import { QUEUE_NAME_CV } from '../src/constants';
import { MyAuthGuard } from '../src/auth/auth.guard';
import { RolesGuard } from '../src/roles/roles.guard';

export class TestHelper {
  public accessToken = '';
  public app: INestApplication;
  public connection: Connection;
  public jwtService: JwtService;
  public cvQueue: Queue;

  public async setup(): Promise<void> {
    this.accessToken = '';

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = module.createNestApplication();

    const reflector = this.app.get(Reflector);
    this.app.useGlobalGuards(new MyAuthGuard(reflector));
    this.app.useGlobalGuards(new RolesGuard(reflector));
    await this.app.init();

    this.connection = module.get<Connection>(Connection);
    this.jwtService = module.get<JwtService>(JwtService);
    this.cvQueue = module.get<Queue>(getQueueToken(QUEUE_NAME_CV));

    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  }

  public sign(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      cvIds: [user.cv.id],
      templateIds: R.map((t) => t.id, user.templates || []),
      roles: R.map((r) => r.name, user.roles || []),
    };
    this.accessToken = this.jwtService.sign(payload);
    return this.accessToken;
  }

  public async resetDb(): Promise<void> {
    await this.connection.synchronize(true);
  }

  public async close(): Promise<void> {
    await this.cvQueue.removeJobs('*');
    await this.app.close();
  }
}
