import * as R from 'ramda';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { SchoolRepository } from '../school.repository';

export default class DeleteSchoolPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(SchoolRepository)
    private readonly schoolRepository: SchoolRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const school = await this.schoolRepository.findOne(params.schoolId, {
      relations: ['educations'],
    });

    return R.isEmpty(school.educations);
  }
}
