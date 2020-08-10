import { Module } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { EducationsController } from './educations.controller';
import { AuthModule } from '../auth/auth.module';
import { EducationsModule } from './educations.module';
import { CVModule } from '../cv/cv.module';

@Module({
  imports: [EducationsModule, AuthModule, CVModule],
  controllers: [EducationsController],
  providers: [EducationsService],
})
export class EducationsHttpModule {}
