import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillSubjectRepository } from './skill-subject.repository';
import { SkillSubjectsService } from './skill-subjects.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkillSubjectRepository])],
  providers: [SkillSubjectsService],
  exports: [TypeOrmModule, SkillSubjectsService],
})
export class SkillSubjectsModule {}
