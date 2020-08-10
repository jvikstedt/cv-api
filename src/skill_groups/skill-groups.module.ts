import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillGroupRepository } from './skill-group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SkillGroupRepository])],
  exports: [TypeOrmModule],
})
export class SkillGroupsModule {}
