import { Connection } from 'typeorm';
import { JobRunner } from '../job-runner';
import { SkillSubjectsMergeJobRunner } from './skill-subjects-merge.runner';

export const BuildRunners = (connection: Connection): JobRunner[] => {
  return [new SkillSubjectsMergeJobRunner(connection)];
};
