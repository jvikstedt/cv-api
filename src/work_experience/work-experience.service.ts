import * as R from 'ramda';
import * as config from 'config';
import { Queue } from 'bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkExperience } from './work-experience.entity';
import { WorkExperienceRepository } from './work-experience.repository';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { PatchWorkExperienceDto } from './dto/patch-work-experience.dto';
import { QUEUE_NAME_CV, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD, EventType } from '../constants';
import { InjectQueue } from '@nestjs/bull';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperienceRepository)
    private readonly workExperienceRepository: WorkExperienceRepository,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  async create(cvId: number, createWorkExperienceDto: CreateWorkExperienceDto): Promise<WorkExperience> {
    const workExperience = await this.workExperienceRepository.createWorkExperience(cvId, createWorkExperienceDto);

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return this.findOne(cvId, workExperience.id);
  }

  async patch(cvId: number, workExperienceId: number, patchWorkExperienceDto: PatchWorkExperienceDto): Promise<WorkExperience> {
    const oldWorkExperience = await this.findOne(cvId, workExperienceId);

    const newWorkExperience = await this.workExperienceRepository.save(
      R.merge(oldWorkExperience, patchWorkExperienceDto),
    );

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return newWorkExperience;
  }

  async findAll(cvId: number): Promise<WorkExperience[]> {
    return this.workExperienceRepository.find({
      where: { cvId },
      relations: ['company'],
    });
  }

  async findOne(cvId: number, workExperienceId: number): Promise<WorkExperience> {
    const entity = await this.workExperienceRepository.findOne(
      { cvId, id: workExperienceId },
      { relations: ['company'] },
    );

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(cvId: number, workExperienceId: number): Promise<WorkExperience> {
    const workExperience = await this.findOne(cvId, workExperienceId);

    await this.workExperienceRepository.delete({ cvId, id: workExperienceId });

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return workExperience;
  }
}
