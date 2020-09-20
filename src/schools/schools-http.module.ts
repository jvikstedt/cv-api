import { Module } from '@nestjs/common';
import { SchoolsController } from './schools.controller';
import { AuthModule } from '../auth/auth.module';
import { SchoolsModule } from './schools.module';

@Module({
  imports: [SchoolsModule, AuthModule],
  controllers: [SchoolsController],
})
export class SchoolsHttpModule {}
