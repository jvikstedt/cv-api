import * as config from 'config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { SkillRepository } from './skill.repository';

import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
  QUEUE_NAME_SKILLS,
} from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

const SkillsQueue = BullModule.registerQueue({
  name: QUEUE_NAME_SKILLS,
  redis: {
    host: 'localhost',
    port: redisConfig[CONFIG_REDIS_PORT],
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillRepository]),
    SkillsQueue,
  ],
  exports: [
    TypeOrmModule,
    SkillsQueue,
  ],
})
export class SkillsModule {}
