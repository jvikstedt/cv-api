import { Module } from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperienceController } from './work-experience.controller';
import { AuthModule } from '../auth/auth.module';
import { WorkExperienceModule } from './work-experience.module';
import { CVModule } from '../cv/cv.module';

@Module({
  imports: [WorkExperienceModule, AuthModule, CVModule],
  controllers: [WorkExperienceController],
  providers: [WorkExperienceService],
})
export class WorkExperienceHttpModule {}
