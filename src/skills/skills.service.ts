import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillRepository } from './skill.repository';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillRepository)
    private readonly skillRepository: SkillRepository,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillRepository.createSkill(createSkillDto);
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);

    skill.experienceInYears = updateSkillDto.experienceInYears;

    return this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find({ relations: ['skillSubject'] });
  }

  async findOne(id: number): Promise<Skill> {
    const entity = await this.skillRepository.findOne(id, { relations: ['skillSubject'] });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(id: number): Promise<Skill> {
    const skill = await this.findOne(id);

    await this.skillRepository.remove(skill);

    return skill;
  }
}
