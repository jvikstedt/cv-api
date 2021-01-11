import { Job } from './job.entity';

export interface JobRunner {
  name(): string;

  run(job: Job): Promise<void>;
}
