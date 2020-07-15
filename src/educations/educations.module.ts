import * as config from 'config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EducationRepository } from './education.repository';

import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
  QUEUE_NAME_EDUCATIONS,
} from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

const EducationsQueue = BullModule.registerQueue({
  name: QUEUE_NAME_EDUCATIONS,
  redis: {
    host: 'localhost',
    port: redisConfig[CONFIG_REDIS_PORT],
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([EducationRepository]),
    EducationsQueue,
  ],
  exports: [
    TypeOrmModule,
    EducationsQueue,
  ],
})
export class EducationsModule {}
