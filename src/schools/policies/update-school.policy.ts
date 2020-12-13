import * as R from 'ramda';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { SchoolRepository } from '../school.repository';

export default class UpdateSchoolPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(SchoolRepository)
    private readonly schoolRepository: SchoolRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const school = await this.schoolRepository.findOne(params.schoolId, {
      relations: ['educations'],
    });

    if (R.isEmpty(school.educations)) {
      return true;
    }

    return R.all(
      (education) => R.includes(education.cvId, user.cvIds),
      school.educations,
    );
  }
}
