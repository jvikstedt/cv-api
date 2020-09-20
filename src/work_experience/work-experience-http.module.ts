import { Module } from '@nestjs/common';
import { WorkExperienceController } from './work-experience.controller';
import { AuthModule } from '../auth/auth.module';
import { WorkExperienceModule } from './work-experience.module';

@Module({
  imports: [WorkExperienceModule, AuthModule],
  controllers: [WorkExperienceController],
})
export class WorkExperienceHttpModule {}
