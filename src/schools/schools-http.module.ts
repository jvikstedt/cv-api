import { Module } from '@nestjs/common';
import { SchoolsController } from './schools.controller';
import { AuthModule } from '../auth/auth.module';
import { SchoolsModule } from './schools.module';
import { DeleteSchoolPolicy, UpdateSchoolPolicy } from './policies';

@Module({
  imports: [SchoolsModule, AuthModule],
  controllers: [SchoolsController],
  providers: [DeleteSchoolPolicy, UpdateSchoolPolicy],
})
export class SchoolsHttpModule {}
