import * as R from 'ramda';
import { Job, Queue } from 'bull';
import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QUEUE_NAME_CV, EventType, ELASTIC_INDEX_CV } from '../constants';
import { CVRepository } from './cv.repository';

@Processor(QUEUE_NAME_CV)
export class CVConsumer {
  private readonly logger = new Logger(CVConsumer.name);

  constructor(
    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,

    @InjectRepository(CVRepository)
    private readonly cvRepository: CVRepository,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    const res = await this.elasticsearchService.indices.exists({ index: ELASTIC_INDEX_CV });
    if (res.statusCode === 404) {
      this.logger.log(`Index ${ELASTIC_INDEX_CV} does not exist, creating...`);
      await this.elasticsearchService.indices.create({ index: ELASTIC_INDEX_CV })
      await this.elasticsearchService.indices.putMapping({
        index: ELASTIC_INDEX_CV,
        body: {
          properties: {
            id: { type: 'integer' },
            description: { type: 'text' },

            userId: { type: 'integer' },
            username: { type: 'keyword' },
            avatarId: { type: 'keyword' },
            fullName: { type: 'text' },

            skills: {
              type: 'nested',
              properties: {
                experienceInYears: { type: 'float' },
                skillSubjectId: { type: 'integer' },
                name: { type: 'text' },
              }
            }
          }
        }
      });
    } else {
      this.logger.log(`Index ${ELASTIC_INDEX_CV} already exists, skipping...`);
    }
  }

  @Process(EventType.Reload)
  async reload(job: Job<any>) {
    try {
      this.logger.debug(`cv id: ${job.data.id}`, `Job (${job.id}): ${QUEUE_NAME_CV}-${EventType.Reload}`);
      const delayedJobs = await this.cvQueue.getDelayed();

      const upcomingJob = R.find((delayedJob: Job<any>) => R.equals(delayedJob.name, job.name) && R.equals(delayedJob.data.id, job.data.id), delayedJobs);
      if (upcomingJob) {
        this.logger.debug(`found upcoming job with same cv id ${job.data.id}`, `Job (${job.id}): ${QUEUE_NAME_CV}-${EventType.Reload}`);
        return;
      }

      const cv = await this.cvRepository.findOne(job.data.id, { relations: ['user', 'skills', 'skills.skillSubject'] });
      if (!cv) {
        await this.elasticsearchService.delete({
          index: ELASTIC_INDEX_CV,
          id: job.data.id.toString(),
        })
      }

      await this.elasticsearchService.index({
        index: ELASTIC_INDEX_CV,
        id: cv.id.toString(),
        body: {
          id: cv.id,
          description: cv.description,
          userId: cv.userId,
          username: cv.user.username,
          avatarId: cv.user.avatarId,
          fullName: `${cv.user.firstName} ${cv.user.lastName}`,
          skills: R.map(skill => ({
            experienceInYears: skill.experienceInYears,
            skillSubjectId: skill.skillSubject.id,
            name: skill.skillSubject.name,
          }), cv.skills),
        },
      });
    } catch(err) {
      this.logger.error(err);
      throw err;
    }
  }
}
