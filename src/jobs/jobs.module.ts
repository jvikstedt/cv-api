import * as config from 'config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { JobRepository } from './job.repository';
import { JobsService } from './jobs.service';
import { JobConsumer } from './job.consumer';

import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
  CONFIG_REDIS_HOST,
  QUEUE_NAME_JOB,
} from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

const JobQueue = BullModule.registerQueue({
  name: QUEUE_NAME_JOB,
  redis: {
    host: redisConfig[CONFIG_REDIS_HOST],
    port: redisConfig[CONFIG_REDIS_PORT],
  },
});

@Module({
  imports: [TypeOrmModule.forFeature([JobRepository]), JobQueue],
  providers: [JobsService, JobConsumer],
  exports: [TypeOrmModule, JobsService, JobQueue],
})
export class JobsModule {}
