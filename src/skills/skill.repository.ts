import * as R from 'ramda';
import * as P from 'bluebird';
import { Skill } from './skill.entity';
import { EntityRepository, Repository, In } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';

@EntityRepository(Skill)
export class SkillRepository extends Repository<Skill> {
  async createSkill(
    cvId: number,
    createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    const skill = this.create({
      skillSubjectId: createSkillDto.skillSubjectId,
      experienceInYears: createSkillDto.experienceInYears,
      interestLevel: createSkillDto.interestLevel,
      highlight: createSkillDto.highlight,
      cvId: cvId,
    });
    return skill.save();
  }

  async getOrCreateSkills(
    cvId: number,
    skillSubjectIds: number[],
  ): Promise<Skill[]> {
    if (R.isEmpty(skillSubjectIds)) {
      return [];
    }

    const existingSkills = await this.find({
      where: {
        cvId,
        skillSubjectId: In(skillSubjectIds),
      },
    });

    return P.map(skillSubjectIds, async (skillSubjectId: number) => {
      let skill = R.find(
        (s) => R.equals(s.skillSubjectId, skillSubjectId),
        existingSkills,
      );

      if (!skill) {
        skill = await this.createSkill(cvId, {
          skillSubjectId,
          experienceInYears: 0,
          interestLevel: 2,
          highlight: false,
        });
      }

      return skill;
    });
  }
}
