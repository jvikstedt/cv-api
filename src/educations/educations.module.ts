import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationRepository } from './education.repository';
import { CVModule } from '../cv/cv.module';
import { EducationsService } from './educations.service';

@Module({
  imports: [TypeOrmModule.forFeature([EducationRepository]), CVModule],
  providers: [EducationsService],
  exports: [TypeOrmModule, EducationsService],
})
export class EducationsModule {}
