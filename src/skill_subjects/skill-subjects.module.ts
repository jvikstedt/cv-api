import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillSubjectRepository } from './skill-subject.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillSubjectRepository]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class SkillSubjectsModule {}
