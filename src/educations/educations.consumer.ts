import * as config from 'config';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME_EDUCATIONS, QUEUE_NAME_CV, EventType, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD } from '../constants';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Processor(QUEUE_NAME_EDUCATIONS)
export class EducationsConsumer {
  private readonly logger = new Logger(EducationsConsumer.name);

  constructor(
    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  @Process(EventType.Insert)
  async insert(job: Job<any>) {
    try {
      await this.cvQueue.add(EventType.Reload, {
        id: job.data.cvId,
      }, {
        delay: cvReloadDelay,
      });
    } catch(err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Process(EventType.Update)
  async update(job: Job<any>) {
    try {
      await this.cvQueue.add(EventType.Reload, {
        id: job.data.new.cvId,
      }, {
        delay: cvReloadDelay,
      });
    } catch(err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Process(EventType.Remove)
  async remove(job: Job<any>) {
    try {
      await this.cvQueue.add(EventType.Reload, {
        id: job.data.cvId,
      }, {
        delay: cvReloadDelay,
      });
    } catch(err) {
      this.logger.error(err);
      throw err;
    }
  }
}
