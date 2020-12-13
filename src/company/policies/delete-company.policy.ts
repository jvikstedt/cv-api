import * as R from 'ramda';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { CompanyRepository } from '../company.repository';

export default class DeleteCompanyPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const company = await this.companyRepository.findOne(params.companyId, {
      relations: ['workExperiences', 'projects'],
    });

    return R.isEmpty(company.workExperiences) && R.isEmpty(company.projects);
  }
}
