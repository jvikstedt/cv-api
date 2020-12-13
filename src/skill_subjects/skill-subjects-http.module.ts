import { Module } from '@nestjs/common';
import { SkillSubjectsController } from './skill-subjects.controller';
import { AuthModule } from '../auth/auth.module';
import { SkillSubjectsModule } from './skill-subjects.module';
import { DeleteSkillSubjectPolicy, UpdateSkillSubjectPolicy } from './policies';

@Module({
  imports: [SkillSubjectsModule, AuthModule],
  controllers: [SkillSubjectsController],
  providers: [DeleteSkillSubjectPolicy, UpdateSkillSubjectPolicy],
})
export class SkillSubjectsHttpModule {}
