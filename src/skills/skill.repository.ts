import { Skill } from './skill.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';

@EntityRepository(Skill)
export class SkillRepository extends Repository<Skill> {
  async createSkill(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.create(createSkillDto);
    return skill.save();
  }
}
