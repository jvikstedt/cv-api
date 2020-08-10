import * as config from 'config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CVRepository } from './cv.repository';

import { CONFIG_REDIS, CONFIG_REDIS_PORT, QUEUE_NAME_CV } from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

const CVQueue = BullModule.registerQueue({
  name: QUEUE_NAME_CV,
  redis: {
    host: 'localhost',
    port: redisConfig[CONFIG_REDIS_PORT],
  },
});

@Module({
  imports: [TypeOrmModule.forFeature([CVRepository]), CVQueue],
  exports: [TypeOrmModule, CVQueue],
})
export class CVModule {}
