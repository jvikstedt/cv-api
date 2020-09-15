import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillRepository } from './skill.repository';
import { CreateSkillDto } from './dto/create-skill.dto';
import { PatchSkillDto } from './dto/patch-skill.dto';
import { CVService } from '../cv/cv.service';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillRepository)
    private readonly skillRepository: SkillRepository,

    private readonly cvService: CVService,
  ) {}

  async create(cvId: number, createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = await this.skillRepository.createSkill(cvId, createSkillDto);

    await this.cvService.reload(cvId);

    return this.findOne(cvId, skill.id);
  }

  async patch(
    cvId: number,
    skillId: number,
    patchSkillDto: PatchSkillDto,
  ): Promise<Skill> {
    const oldSkill = await this.findOne(cvId, skillId);

    const newSkill = await this.skillRepository.save(
      R.merge(oldSkill, patchSkillDto),
    );

    await this.cvService.reload(cvId);

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

    await this.cvService.reload(cvId);

    return skill;
  }
}
