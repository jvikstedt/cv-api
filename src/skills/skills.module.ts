import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillRepository } from './skill.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SkillRepository])],
  exports: [TypeOrmModule],
})
export class SkillsModule {}
