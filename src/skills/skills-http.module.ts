import * as config from 'config';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { SkillSubscriber } from './skill.subscriber';
import { QUEUE_NAME_SKILLS, QUEUE_NAME_CV } from '../constants';
import { SkillsConsumer } from './skills.consumer';
import { AuthModule } from '../auth/auth.module';
import { SkillsModule } from './skills.module';

import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
} from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

@Module({
  imports: [
    SkillsModule,
    AuthModule,
    BullModule.registerQueue({
      name: QUEUE_NAME_SKILLS,
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
  controllers: [SkillsController],
  providers: [SkillsService, SkillSubscriber, SkillsConsumer],
})
export class SkillsHttpModule {}
