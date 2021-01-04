import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillSubjectsModule } from '../skill_subjects/skill-subjects.module';
import { MergeRequestRepository } from './merge-request.repository';
import { MergeRequestsService } from './merge-requests.service';
import { SkillSubjectsMergeHelper } from './helpers/skill-subjects-merge.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([MergeRequestRepository]),
    SkillSubjectsModule,
  ],
  providers: [MergeRequestsService, SkillSubjectsMergeHelper],
  exports: [TypeOrmModule, MergeRequestsService],
})
export class MergeRequestsModule {}
