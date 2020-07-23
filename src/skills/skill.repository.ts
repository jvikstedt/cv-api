import { Skill } from './skill.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';

@EntityRepository(Skill)
export class SkillRepository extends Repository<Skill> {
  async createSkill(cvId: number, createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.create({
      skillSubjectId: createSkillDto.skillSubjectId,
      experienceInYears: createSkillDto.experienceInYears,
      highlight: createSkillDto.highlight,
      cvId: cvId,
    });
    return skill.save();
  }
}
