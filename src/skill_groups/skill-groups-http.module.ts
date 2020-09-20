import { Module } from '@nestjs/common';
import { SkillGroupsController } from './skill-groups.controller';
import { AuthModule } from '../auth/auth.module';
import { SkillGroupsModule } from './skill-groups.module';

@Module({
  imports: [SkillGroupsModule, AuthModule],
  controllers: [SkillGroupsController],
})
export class SkillGroupsHttpModule {}
