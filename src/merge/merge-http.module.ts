import { Module } from '@nestjs/common';
import { MergeController } from './merge.controller';
import { MergeService } from './merge.service';

@Module({
  providers: [MergeService],
  controllers: [MergeController],
})
export class MergeHttpModule {}
