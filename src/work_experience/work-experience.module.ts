import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceRepository } from './work-experience.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperienceRepository])],
  exports: [TypeOrmModule],
})
export class WorkExperienceModule {}
