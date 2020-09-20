import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceRepository } from './work-experience.repository';
import { CVModule } from '../cv/cv.module';
import { WorkExperienceService } from './work-experience.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperienceRepository]), CVModule],
  providers: [WorkExperienceService],
  exports: [TypeOrmModule, WorkExperienceService],
})
export class WorkExperienceModule {}
