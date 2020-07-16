import * as R from 'ramda';
import * as config from 'config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillRepository } from './skill.repository';
import { CreateSkillDto } from './dto/create-skill.dto';
import { PatchSkillDto } from './dto/patch-skill.dto';
import { QUEUE_NAME_CV, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD, EventType } from '../constants';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillRepository)
    private readonly skillRepository: SkillRepository,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  async create(cvId: number, createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = await this.skillRepository.createSkill(cvId, createSkillDto);

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return this.findOne(cvId, skill.id);
  }

  async patch(cvId: number, skillId: number, patchSkillDto: PatchSkillDto): Promise<Skill> {
    const oldSkill = await this.findOne(cvId, skillId);

    const newSkill = await this.skillRepository.save(
      R.merge(oldSkill, {
        experienceInYears: patchSkillDto.experienceInYears,
      }),
    );

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return newSkill;
  }

  async findAll(cvId: number): Promise<Skill[]> {
    return this.skillRepository.find({
      where: { cvId },
      relations: ['skillSubject', 'skillSubject.skillGroup'],
    });
  }

  async findOne(cvId: number, skillId: number): Promise<Skill> {
    const entity = await this.skillRepository.findOne(
      { cvId, id: skillId },
      { relations: ['skillSubject', 'skillSubject.skillGroup'] },
    );

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(cvId: number, skillId: number): Promise<Skill> {
    const skill = await this.findOne(cvId, skillId);

    await this.skillRepository.delete({ cvId, id: skillId });

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return skill;
  }
}
