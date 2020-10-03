import { ProjectMembership } from './project-membership.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';

@EntityRepository(ProjectMembership)
export class ProjectMembershipRepository extends Repository<ProjectMembership> {
  async createProjectMembership(
    cvId: number,
    createProjectMembershipDto: CreateProjectMembershipDto,
  ): Promise<ProjectMembership> {
    const projectMembership = this.create({
      cvId: cvId,
      projectId: createProjectMembershipDto.projectId,
      description: createProjectMembershipDto.description,
      startYear: createProjectMembershipDto.startYear,
      startMonth: createProjectMembershipDto.startMonth,
      endYear: createProjectMembershipDto.endYear,
      endMonth: createProjectMembershipDto.endMonth,
      highlight: createProjectMembershipDto.highlight,
    });
    return projectMembership.save();
  }
}
