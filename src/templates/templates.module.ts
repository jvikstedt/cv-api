import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateRepository } from './template.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateRepository]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class TemplatesModule {}
