import * as config from 'config';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { BullModule } from '@nestjs/bull';
import { CVService } from './cv.service';
import { CVController } from './cv.controller';
import { CVConsumer } from './cv.consumer';
import { AuthModule } from '../auth/auth.module';
import { ElasticsearchConfigService } from '../config/elasticsearch.config';
import { CVModule } from './cv.module';
import {
  CONFIG_REDIS,
  CONFIG_REDIS_PORT,
  QUEUE_NAME_CV,
} from '../constants';

const redisConfig = config.get(CONFIG_REDIS);

@Module({
  imports: [
    CVModule,
    AuthModule,
    BullModule.registerQueue({
      name: QUEUE_NAME_CV,
      redis: {
        host: 'localhost',
        port: redisConfig[CONFIG_REDIS_PORT],
      },
    }),
    ElasticsearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
  ],
  controllers: [CVController],
  providers: [CVService, CVConsumer],
})
export class CVHttpModule {}
