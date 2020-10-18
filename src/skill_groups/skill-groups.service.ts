import * as R from 'ramda';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillGroup } from './skill-group.entity';
import { SkillGroupRepository } from './skill-group.repository';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';
import { SearchSkillGroupDto } from './dto/search-skill-group.dto';
import { PatchSkillGroupDto } from './dto/patch-skill-group-dto';

@Injectable()
export class SkillGroupsService {
  constructor(
    @InjectRepository(SkillGroupRepository)
    private readonly skillGroupRepository: SkillGroupRepository,
  ) {}

  async create(createSkillGroupDto: CreateSkillGroupDto): Promise<SkillGroup> {
    const skillGroups = await this.skillGroupRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: createSkillGroupDto.name,
      })
      .getMany();

    if (skillGroups.length > 0) {
      throw new UnprocessableEntityException(
        `Skill group '${createSkillGroupDto.name}' already exists`,
      );
    }

    const skillGroup = await this.skillGroupRepository.createSkillGroup(
      createSkillGroupDto,
    );

    return skillGroup;
  }

  async patch(
    skillGroupId: number,
    patchSkillGroupDto: PatchSkillGroupDto,
  ): Promise<SkillGroup> {
    const oldSkillGroup = await this.findOne(skillGroupId);

    const newSkillGroup = R.merge(oldSkillGroup, patchSkillGroupDto);

    return this.skillGroupRepository.save(newSkillGroup);
  }

  async findAll(): Promise<SkillGroup[]> {
    return this.skillGroupRepository.find();
  }

  async findOne(skillGroupId: number): Promise<SkillGroup> {
    const entity = await this.skillGroupRepository.findOne(skillGroupId);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(skillGroupId: number): Promise<void> {
    const result = await this.skillGroupRepository.delete(skillGroupId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async search(
    searchSkillGroupDto: SearchSkillGroupDto,
  ): Promise<{ items: SkillGroup[]; total: number }> {
    const [items, total] = await this.skillGroupRepository
      .createQueryBuilder('skillGroup')
      .where('skillGroup.name ilike :name', {
        name: `%${searchSkillGroupDto.name}%`,
      })
      .orderBy(
        searchSkillGroupDto.orderColumnName,
        searchSkillGroupDto.orderSort,
      )
      .skip(searchSkillGroupDto.skip)
      .take(searchSkillGroupDto.take)
      .getManyAndCount();

    return {
      items,
      total,
    };
  }
}
