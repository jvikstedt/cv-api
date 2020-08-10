import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillGroup } from './skill-group.entity';
import { SkillGroupRepository } from './skill-group.repository';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';
import { UpdateSkillGroupDto } from './dto/update-skill-group.dto';
import { SearchSkillGroupDto } from './dto/search-skill-group.dto';

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
      throw new UnprocessableEntityException();
    }

    const skillGroup = await this.skillGroupRepository.createSkillGroup(
      createSkillGroupDto,
    );

    return skillGroup;
  }

  async update(
    id: number,
    updateSkillGroupDto: UpdateSkillGroupDto,
  ): Promise<SkillGroup> {
    const skillGroup = await this.findOne(id);

    skillGroup.name = updateSkillGroupDto.name;

    return await this.skillGroupRepository.save(skillGroup);
  }

  async findAll(): Promise<SkillGroup[]> {
    return this.skillGroupRepository.find();
  }

  async findOne(id: number): Promise<SkillGroup> {
    const entity = await this.skillGroupRepository.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(id: number): Promise<void> {
    const result = await this.skillGroupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async search(
    searchSkillGroupDto: SearchSkillGroupDto,
  ): Promise<SkillGroup[]> {
    return this.skillGroupRepository
      .createQueryBuilder()
      .where('name ilike :name', { name: `%${searchSkillGroupDto.name}%` })
      .limit(searchSkillGroupDto.limit)
      .getMany();
  }
}
