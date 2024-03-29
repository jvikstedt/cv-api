import * as config from 'config';
import * as R from 'ramda';
import { Job, Queue } from 'bull';
import { DateTime } from 'luxon';
import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  QUEUE_NAME_CV,
  EventType,
  ELASTIC_INDEX_CV,
  CONFIG_QUEUE,
  CONFIG_QUEUE_CV_RELOAD,
} from '../constants';
import { CVRepository } from '../cv/cv.repository';
import { Skill } from '../skills/skill.entity';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

const calculateTotalSkillExperience = (skill: Skill): number => {
  const experience = R.reduce(
    (sum: number, membershipSkill) => {
      const projectMembership = membershipSkill.projectMembership;

      if (!membershipSkill.automaticCalculation) {
        return sum + membershipSkill.experienceInYears;
      }

      const diff = DateTime.utc(
        projectMembership.endYear || DateTime.utc().year,
        projectMembership.endMonth || DateTime.utc().month,
      ).diff(
        DateTime.utc(projectMembership.startYear, projectMembership.startMonth),
        ['years'],
      );

      if (R.isNil(diff['values']) || R.isNil(diff['values'].years)) {
        return sum;
      }

      return sum + diff['values'].years;
    },
    0,
    skill.membershipSkills,
  );

  const projectExperience = Math.round(experience * 100) / 100;

  const totalExperience =
    Math.round((projectExperience + skill.experienceInYears) * 100) / 100;

  return totalExperience;
};

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

  async onModuleInit(): Promise<void> {
    const res = await this.elasticsearchService.indices.exists({
      index: ELASTIC_INDEX_CV,
    });
    if (res.statusCode === 404) {
      this.logger.log(`Index ${ELASTIC_INDEX_CV} does not exist, creating...`);
      await this.elasticsearchService.indices.create({
        index: ELASTIC_INDEX_CV,
      });
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
            jobTitle: { type: 'text' },
            phone: { type: 'text' },
            location: { type: 'text' },
            email: { type: 'keyword' },

            skills: {
              type: 'nested',
              properties: {
                experienceInYears: { type: 'float' },
                interestLevel: { type: 'integer' },
                highlight: { type: 'boolean' },
                skillSubjectId: { type: 'integer' },
                name: { type: 'text' },
              },
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
              },
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
              },
            },

            projectMemberships: {
              type: 'nested',
              properties: {
                projectId: { type: 'integer' },
                projectName: { type: 'text' },
                companyId: { type: 'integer' },
                companyName: { type: 'text' },
                startYear: { type: 'integer' },
                startMonth: { type: 'integer' },
                endYear: { type: 'integer' },
                endMonth: { type: 'integer' },
                description: { type: 'text' },
                role: { type: 'text' },
              },
            },
          },
        },
      });
    } else {
      this.logger.log(`Index ${ELASTIC_INDEX_CV} already exists, skipping...`);
    }

    const cvs = await this.cvRepository.find();

    for (const cv of cvs) {
      await this.cvQueue.add(
        EventType.Reload,
        {
          id: cv.id,
        },
        {
          delay: cvReloadDelay,
        },
      );
    }
  }

  @Process(EventType.Reload)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async reload(job: Job<any>): Promise<void> {
    try {
      this.logger.debug(
        `cv id: ${job.data.id}`,
        `Job (${job.id}): ${QUEUE_NAME_CV}-${EventType.Reload}`,
      );
      const delayedJobs = await this.cvQueue.getDelayed();

      const upcomingJob = R.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (delayedJob: Job<any>) =>
          R.equals(delayedJob.name, job.name) &&
          R.equals(delayedJob.data.id, job.data.id),
        delayedJobs,
      );
      if (upcomingJob) {
        this.logger.debug(
          `found upcoming job with same cv id ${job.data.id}`,
          `Job (${job.id}): ${QUEUE_NAME_CV}-${EventType.Reload}`,
        );
        return;
      }

      let cv = await this.cvRepository.findOne(job.data.id, {
        relations: [
          'user',
          'skills',
          'skills.skillSubject',
          'skills.membershipSkills',
          'skills.membershipSkills.projectMembership',
          'educations',
          'educations.school',
          'workExperiences',
          'workExperiences.company',
          'projectMemberships',
          'projectMemberships.project',
          'projectMemberships.project.company',
        ],
      });
      if (!cv) {
        await this.elasticsearchService.delete({
          index: ELASTIC_INDEX_CV,
          id: job.data.id.toString(),
        });
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
          jobTitle: cv.user.jobTitle,
          phone: cv.user.phone,
          location: cv.user.location,
          email: cv.user.email,
          skills: R.map(
            (skill) => ({
              experienceInYears: calculateTotalSkillExperience(skill),
              interestLevel: skill.interestLevel,
              highlight: skill.highlight,
              skillSubjectId: skill.skillSubject.id,
              name: skill.skillSubject.name,
            }),
            cv.skills,
          ),
          educations: R.map(
            (education) => ({
              schoolId: education.school.id,
              schoolName: education.school.name,
              startYear: education.startYear,
              endYear: education.endYear,
              degree: education.degree,
              fieldOfStudy: education.fieldOfStudy,
              description: education.description,
            }),
            cv.educations,
          ),
          workExperiences: R.map(
            (workExperience) => ({
              companyId: workExperience.company.id,
              companyName: workExperience.company.name,
              startYear: workExperience.startYear,
              startMonth: workExperience.startMonth,
              endYear: workExperience.endYear,
              endMonth: workExperience.endMonth,
              description: workExperience.description,
              jobTitle: workExperience.jobTitle,
            }),
            cv.workExperiences,
          ),
          projectMemberships: R.map(
            (projectMembership) => ({
              projectId: projectMembership.project.id,
              projectName: projectMembership.project.name,
              companyId: projectMembership.project.company.id,
              companyName: projectMembership.project.company.name,
              startYear: projectMembership.startYear,
              startMonth: projectMembership.startMonth,
              endYear: projectMembership.endYear,
              endMonth: projectMembership.endMonth,
              description: projectMembership.description,
              role: projectMembership.role,
            }),
            cv.projectMemberships,
          ),
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
