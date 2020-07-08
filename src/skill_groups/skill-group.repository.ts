import { SkillGroup } from './skill-group.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';

@EntityRepository(SkillGroup)
export class SkillGroupRepository extends Repository<SkillGroup> {
  async createSkillGroup(createSkillGroupDto: CreateSkillGroupDto): Promise<SkillGroup> {
    const { name } = createSkillGroupDto;

    const skillGroup = this.create({ name });
    return skillGroup.save();
  }
}
