import { Module } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { EducationsController } from './educations.controller';
import { EducationSubscriber } from './education.subscriber';
import { AuthModule } from '../auth/auth.module';
import { EducationsModule } from './educations.module';

@Module({
  imports: [
    EducationsModule,
    AuthModule,
  ],
  controllers: [EducationsController],
  providers: [EducationsService, EducationSubscriber],
})
export class EducationsHttpModule {}
