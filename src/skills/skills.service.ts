import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillRepository } from './skill.repository';
import { CreateSkillDto } from './dto/create-skill.dto';
import { PatchSkillDto } from './dto/patch-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillRepository)
    private readonly skillRepository: SkillRepository,
  ) {}

  async create(cvId: number, createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = await this.skillRepository.createSkill(cvId, createSkillDto);

    return this.findOne(cvId, skill.id);
  }

  async patchSkill(cvId: number, skillId: number, patchSkillDto: PatchSkillDto): Promise<Skill> {
    const oldSkill = await this.findOne(cvId, skillId);

    const newSkill = R.merge(oldSkill, {
      experienceInYears: patchSkillDto.experienceInYears,
    });

    return this.skillRepository.save(newSkill);
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

    return skill;
  }
}
