import { Module } from '@nestjs/common';
import { SkillSubjectsController } from './skill-subjects.controller';
import { AuthModule } from '../auth/auth.module';
import { SkillSubjectsModule } from './skill-subjects.module';

@Module({
  imports: [SkillSubjectsModule, AuthModule],
  controllers: [SkillSubjectsController],
})
export class SkillSubjectsHttpModule {}
