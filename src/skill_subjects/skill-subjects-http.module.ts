import { Module } from '@nestjs/common';
import { SkillSubjectsService } from './skill-subjects.service';
import { SkillSubjectsController } from './skill-subjects.controller';
import { AuthModule } from '../auth/auth.module';
import { SkillSubjectsModule } from './skill-subjects.module';

@Module({
  imports: [
    SkillSubjectsModule,
    AuthModule,
  ],
  controllers: [SkillSubjectsController],
  providers: [SkillSubjectsService],
})
export class SkillSubjectsHttpModule {}
