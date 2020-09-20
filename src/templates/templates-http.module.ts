import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { AuthModule } from '../auth/auth.module';
import { TemplatesModule } from './templates.module';

@Module({
  imports: [TemplatesModule, AuthModule],
  controllers: [TemplatesController],
})
export class TemplatesHttpModule {}
