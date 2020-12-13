import * as R from 'ramda';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { CompanyRepository } from '../company.repository';

export default class UpdateCompanyPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const company = await this.companyRepository.findOne(params.companyId, {
      relations: ['workExperiences', 'projects', 'projects.projectMemberships'],
    });

    const allProjectMemberships = R.flatten(
      R.map((project) => project.projectMemberships, company.projects),
    );

    return (
      R.all(
        (workExperience) => R.includes(workExperience.cvId, user.cvIds),
        company.workExperiences,
      ) && R.all((pm) => R.includes(pm.cvId, user.cvIds), allProjectMemberships)
    );
  }
}
