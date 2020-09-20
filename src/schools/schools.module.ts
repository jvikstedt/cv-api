import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolRepository } from './school.repository';
import { SchoolsService } from './schools.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolRepository])],
  providers: [SchoolsService],
  exports: [TypeOrmModule, SchoolsService],
})
export class SchoolsModule {}
