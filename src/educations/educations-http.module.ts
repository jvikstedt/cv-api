import { Module } from '@nestjs/common';
import { EducationsController } from './educations.controller';
import { AuthModule } from '../auth/auth.module';
import { EducationsModule } from './educations.module';

@Module({
  imports: [EducationsModule, AuthModule],
  controllers: [EducationsController],
})
export class EducationsHttpModule {}
