import * as R from 'ramda';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { ProjectRepository } from '../project.repository';

export default class UpdateProjectPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const project = await this.projectRepository.findOne(params.projectId, {
      relations: ['projectMemberships'],
    });

    return R.all(
      (projectMembership) => R.includes(projectMembership.cvId, user.cvIds),
      project.projectMemberships,
    );
  }
}
