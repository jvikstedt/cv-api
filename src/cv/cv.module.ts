import * as config from 'config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CVRepository } from './cv.repository';
import { CVService } from './cv.service';

import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
  CONFIG_REDIS_HOST,
  QUEUE_NAME_CV,
} from '../constants';
import { ElasticsearchConfigService } from '../config/elasticsearch.config';

const redisConfig = config.get(CONFIG_REDIS);

const CVQueue = BullModule.registerQueue({
  name: QUEUE_NAME_CV,
  redis: {
    host: redisConfig[CONFIG_REDIS_HOST],
    port: redisConfig[CONFIG_REDIS_PORT],
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([CVRepository]),
    CVQueue,
    ElasticsearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
  ],
  providers: [CVService],
  exports: [TypeOrmModule, CVService, CVQueue],
})
export class CVModule {}
