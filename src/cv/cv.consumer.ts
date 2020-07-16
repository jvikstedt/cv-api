import * as config from 'config';
import * as R from 'ramda';
import { Job, Queue } from 'bull';
import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QUEUE_NAME_CV, EventType, ELASTIC_INDEX_CV, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD } from '../constants';
import { CVRepository } from './cv.repository';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

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
            updatedAt: { type: 'date' },

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
            },

            educations: {
              type: 'nested',
              properties: {
                schoolId: { type: 'integer' },
                schoolName: { type: 'text' },
                startYear: { type: 'integer' },
                endYear: { type: 'integer' },
                degree: { type: 'text' },
                fieldOfStudy: { type: 'text' },
                description: { type: 'text' },
              }
            },

            workExperiences: {
              type: 'nested',
              properties: {
                companyId: { type: 'integer' },
                companyName: { type: 'text' },
                startYear: { type: 'integer' },
                startMonth: { type: 'integer' },
                endYear: { type: 'integer' },
                endMonth: { type: 'integer' },
                description: { type: 'text' },
                jobTitle: { type: 'text' },
              }
            }
          }
        }
      });
    } else {
      this.logger.log(`Index ${ELASTIC_INDEX_CV} already exists, skipping...`);
    }

    const cvs = await this.cvRepository.find();

    for (const cv of cvs) {
      await this.cvQueue.add(EventType.Reload, {
        id: cv.id,
      }, {
        delay: cvReloadDelay,
      });
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

      let cv = await this.cvRepository.findOne(job.data.id, {
        relations: [
          'user',
          'skills',
          'skills.skillSubject',
          'educations',
          'educations.school',
          'workExperiences',
          'workExperiences.company',
        ]
      });
      if (!cv) {
        await this.elasticsearchService.delete({
          index: ELASTIC_INDEX_CV,
          id: job.data.id.toString(),
        })
        return;
      } else {
        if (job.data.updateTimestamp) {
          cv.updatedAt = new Date();
          cv = await cv.save();
        }
      }

      await this.elasticsearchService.index({
        index: ELASTIC_INDEX_CV,
        id: cv.id.toString(),
        body: {
          id: cv.id,
          description: cv.description,
          updatedAt: cv.updatedAt,
          userId: cv.userId,
          username: cv.user.username,
          avatarId: cv.user.avatarId,
          fullName: `${cv.user.firstName} ${cv.user.lastName}`,
          skills: R.map(skill => ({
            experienceInYears: skill.experienceInYears,
            skillSubjectId: skill.skillSubject.id,
            name: skill.skillSubject.name,
          }), cv.skills),
          educations: R.map(education => ({
            schoolId: education.school.id,
            schoolName: education.school.name,
            startYear: education.startYear,
            endYear: education.endYear,
            degree: education.degree,
            fieldOfStudy: education.fieldOfStudy,
            description: education.description,
          }), cv.educations),
          workExperiences: R.map(workExperience => ({
            companyId: workExperience.company.id,
            companyName: workExperience.company.name,
            startYear: workExperience.startYear,
            startMonth: workExperience.startMonth,
            endYear: workExperience.endYear,
            endMonth: workExperience.endMonth,
            description: workExperience.description,
            jobTitle: workExperience.jobTitle,
          }), cv.workExperiences),
        },
      });
    } catch(err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Process(EventType.Insert)
  async insert(job: Job<any>) {
    try {
      await this.cvQueue.add(EventType.Reload, {
        id: job.data.id,
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
        id: job.data.new.id,
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
        id: job.data.id,
      }, {
        delay: cvReloadDelay,
      });
    } catch(err) {
      this.logger.error(err);
      throw err;
    }
  }
}
