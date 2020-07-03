import * as config from 'config';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';
import { UserSubscriber } from './user.subscriber';
import { UsersConsumer } from './users.consumer';
import { QUEUE_NAME_USERS, QUEUE_NAME_CV } from '../constants';

import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
} from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BullModule.registerQueue({
      name: QUEUE_NAME_USERS,
      redis: {
        host: 'localhost',
        port: redisConfig[CONFIG_REDIS_PORT],
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME_CV,
      redis: {
        host: 'localhost',
        port: redisConfig[CONFIG_REDIS_PORT],
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserSubscriber,
    UsersConsumer,
  ],
})
export class UsersHttpModule {}
