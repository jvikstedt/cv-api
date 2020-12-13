import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { AuthModule } from '../auth/auth.module';
import { TemplatesModule } from './templates.module';
import { TemplateOwnerPolicy } from './policies';

@Module({
  imports: [TemplatesModule, AuthModule],
  controllers: [TemplatesController],
  providers: [TemplateOwnerPolicy],
})
export class TemplatesHttpModule {}
