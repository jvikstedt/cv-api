import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { AuthModule } from '../auth/auth.module';
import { TemplatesModule } from './templates.module';

@Module({
  imports: [TemplatesModule, AuthModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesHttpModule {}
