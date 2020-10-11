import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { CVModule } from '../cv/cv.module';
import { CVConsumer } from './cv.consumer';

import { ElasticsearchConfigService } from '../config/elasticsearch.config';

@Module({
  imports: [
    CVModule,
    ElasticsearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
  ],
  providers: [CVConsumer],
})
export class SyncModule {}
