import * as config from 'config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UserRepository } from './user.repository';

import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
  QUEUE_NAME_USERS,
} from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

const UsersQueue = BullModule.registerQueue({
  name: QUEUE_NAME_USERS,
  redis: {
    host: 'localhost',
    port: redisConfig[CONFIG_REDIS_PORT],
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    UsersQueue,
  ],
  exports: [
    TypeOrmModule,
    UsersQueue,
  ],
})
export class UsersModule {}
