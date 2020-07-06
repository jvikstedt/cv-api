import * as config from 'config';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME_CV, EventType, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD, QUEUE_NAME_USERS } from '../constants';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Processor(QUEUE_NAME_USERS)
export class UsersConsumer {
  private readonly logger = new Logger(UsersConsumer.name);

  constructor(
    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  @Process(EventType.Update)
  async update(job: Job<any>) {
    try {
      const id = job.data.new.cvId;

      const user = await this.userRepository.findOne(id, {
        relations: ['cv'],
      });

      await this.cvQueue.add(EventType.Reload, {
        id: user.cv.id,
      }, {
        delay: cvReloadDelay,
      });
    } catch(err) {
      this.logger.error(err);
      throw err;
    }
  }
}
