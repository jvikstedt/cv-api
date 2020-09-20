import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { AuthModule } from '../auth/auth.module';
import { SkillsModule } from './skills.module';

@Module({
  imports: [SkillsModule, AuthModule],
  controllers: [SkillsController],
})
export class SkillsHttpModule {}
