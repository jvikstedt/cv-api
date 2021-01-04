import { Module } from '@nestjs/common';
import { MergeRequestsController } from './merge-requests.controller';
import { MergeRequestsModule } from './merge-requests.module';
import { MergeRequestOwnerPolicy } from './policies';

@Module({
  imports: [MergeRequestsModule],
  controllers: [MergeRequestsController],
  providers: [MergeRequestOwnerPolicy],
})
export class MergeRequestsHttpModule {}
