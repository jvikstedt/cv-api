import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateRepository } from './template.repository';
import { TemplatesService } from './templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateRepository])],
  providers: [TemplatesService],
  exports: [TypeOrmModule, TemplatesService],
})
export class TemplatesModule {}
