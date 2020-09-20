import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillGroupRepository } from './skill-group.repository';
import { SkillGroupsService } from './skill-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkillGroupRepository])],
  providers: [SkillGroupsService],
  exports: [TypeOrmModule, SkillGroupsService],
})
export class SkillGroupsModule {}
