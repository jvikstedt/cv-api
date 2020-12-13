import * as R from 'ramda';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { SkillSubjectRepository } from '../skill-subject.repository';

export default class UpdateSkillSubjectPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(SkillSubjectRepository)
    private readonly skillSubjectRepository: SkillSubjectRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const skillSubject = await this.skillSubjectRepository.findOne(
      params.skillSubjectId,
      {
        relations: ['skills'],
      },
    );

    return R.all(
      (skill) => R.includes(skill.cvId, user.cvIds),
      skillSubject.skills,
    );
  }
}
