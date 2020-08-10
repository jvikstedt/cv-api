import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationRepository } from './education.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EducationRepository])],
  exports: [TypeOrmModule],
})
export class EducationsModule {}
