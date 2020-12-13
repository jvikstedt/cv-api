import * as R from 'ramda';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { SkillGroupRepository } from '../skill-group.repository';

export default class UpdateSkillGroupPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(SkillGroupRepository)
    private readonly skillGroupRepository: SkillGroupRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const skillGroup = await this.skillGroupRepository.findOne(
      params.skillGroupId,
      {
        relations: ['skillSubjects', 'skillSubjects.skills'],
      },
    );

    const allSkills = R.flatten(
      R.map((ss) => ss.skills, skillGroup.skillSubjects),
    );

    return R.all((skill) => R.includes(skill.cvId, user.cvIds), allSkills);
  }
}
