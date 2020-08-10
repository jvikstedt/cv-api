import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolRepository } from './school.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolRepository])],
  exports: [TypeOrmModule],
})
export class SchoolsModule {}
