import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsModule } from './jobs.module';
import { JobOwnerPolicy } from './policies';

@Module({
  imports: [JobsModule],
  controllers: [JobsController],
  providers: [JobOwnerPolicy],
})
export class JobsHttpModule {}
