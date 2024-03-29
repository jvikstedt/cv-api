import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMembershipRepository } from './project-membership.repository';
import { CVModule } from '../cv/cv.module';
import { ProjectMembershipService } from './project-membership.service';
import { MembershipSkillModule } from '../membership_skill/membership-skill.module';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMembershipRepository]),
    CVModule,
    SkillsModule,
    MembershipSkillModule,
  ],
  providers: [ProjectMembershipService],
  exports: [TypeOrmModule, ProjectMembershipService],
})
export class ProjectMembershipModule {}
