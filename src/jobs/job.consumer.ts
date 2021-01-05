import * as R from 'ramda';
import { Job as BullJob } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { QUEUE_NAME_JOB, JobEventType } from '../constants';
import { Connection } from 'typeorm';
import { JobRepository } from './job.repository';
import { JobRunner } from './job-runner';
import { BuildRunners } from './runners';
import { Job, State } from './job.entity';

@Processor(QUEUE_NAME_JOB)
export class JobConsumer {
  private readonly logger = new Logger(JobConsumer.name);
  private runners: { [key: string]: JobRunner } = {};

  constructor(
    @InjectRepository(JobRepository)
    private readonly jobRepository: JobRepository,

    private connection: Connection,
  ) {}

  async onModuleInit(): Promise<void> {
    for (const runner of BuildRunners(this.connection)) {
      this.runners[runner.name()] = runner;
    }
  }

  @Process(JobEventType.Run)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async reload(bullJob: BullJob<any>): Promise<void> {
    const jobId = bullJob.data.id;
    const job: Job = await this.jobRepository.findOne(jobId);

    try {
      this.logger.debug(
        `cv id: ${bullJob.data.id}`,
        `Job (${bullJob.id}): ${QUEUE_NAME_JOB}-${JobEventType.Run}`,
      );

      if (!job) {
        throw new Error(`Could not find job ${jobId}`);
      }

      let newJob = R.merge(job, {
        state: State.Running,
      });
      await this.jobRepository.save(newJob);

      const runner = this.runners[job.runner];

      if (!runner) {
        throw new Error(`could not find runner ${job.runner}`);
      }

      await runner.run(job);

      newJob = R.merge(job, {
        state: State.Completed,
      });
      await this.jobRepository.save(newJob);
    } catch (err) {
      this.logger.error(err);
      if (job) {
        const newJob = R.merge(job, {
          state: State.Failed,
          log: `${job.log}\n${err}`,
        });
        await this.jobRepository.save(newJob);
      }
      throw err;
    }
  }
}
