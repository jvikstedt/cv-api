import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CVService } from './cv.service';
import { CVController } from './cv.controller';
import { CVSubscriber } from './cv.subscriber';
import { CVConsumer } from './cv.consumer';
import { AuthModule } from '../auth/auth.module';
import { ElasticsearchConfigService } from '../config/elasticsearch.config';
import { CVModule } from './cv.module';

@Module({
  imports: [
    CVModule,
    AuthModule,
    ElasticsearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
  ],
  controllers: [CVController],
  providers: [CVService, CVSubscriber, CVConsumer],
})
export class CVHttpModule {}
