import { Module } from '@nestjs/common';
import { SkillGroupsController } from './skill-groups.controller';
import { AuthModule } from '../auth/auth.module';
import { SkillGroupsModule } from './skill-groups.module';
import { DeleteSkillGroupPolicy, UpdateSkillGroupPolicy } from './policies';

@Module({
  imports: [SkillGroupsModule, AuthModule],
  controllers: [SkillGroupsController],
  providers: [DeleteSkillGroupPolicy, UpdateSkillGroupPolicy],
})
export class SkillGroupsHttpModule {}
