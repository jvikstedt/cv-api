import * as R from 'ramda';
import * as config from 'config';
import { Queue } from 'bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './education.entity';
import { EducationRepository } from './education.repository';
import { CreateEducationDto } from './dto/create-education.dto';
import { PatchEducationDto } from './dto/patch-education.dto';
import { QUEUE_NAME_CV, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD, EventType } from '../constants';
import { InjectQueue } from '@nestjs/bull';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Injectable()
export class EducationsService {
  constructor(
    @InjectRepository(EducationRepository)
    private readonly educationRepository: EducationRepository,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  async create(cvId: number, createEducationDto: CreateEducationDto): Promise<Education> {
    const education = await this.educationRepository.createEducation(cvId, createEducationDto);

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
    }, {
      delay: cvReloadDelay,
    });

    return this.findOne(cvId, education.id);
  }

  async patch(cvId: number, educationId: number, patchEducationDto: PatchEducationDto): Promise<Education> {
    const oldEducation = await this.findOne(cvId, educationId);

    const newEducation = await this.educationRepository.save(
      R.merge(oldEducation, patchEducationDto),
    );

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
    }, {
      delay: cvReloadDelay,
    });

    return newEducation;
  }

  async findAll(cvId: number): Promise<Education[]> {
    return this.educationRepository.find({
      where: { cvId },
      relations: ['school'],
    });
  }

  async findOne(cvId: number, educationId: number): Promise<Education> {
    const entity = await this.educationRepository.findOne(
      { cvId, id: educationId },
      { relations: ['school'] },
    );

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(cvId: number, educationId: number): Promise<Education> {
    const education = await this.findOne(cvId, educationId);

    await this.educationRepository.delete({ cvId, id: educationId });

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
    }, {
      delay: cvReloadDelay,
    });

    return education;
  }
}
