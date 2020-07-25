import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { ProjectMembershipRepository } from './project-membership.repository';
import { ProjectMembership } from './project-membership.entity';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';

describe('ProjectMembershipRepository', () => {
  let projectMembershipRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectMembershipRepository,
      ],
    }).compile();

    projectMembershipRepository = module.get<ProjectMembershipRepository>(ProjectMembershipRepository);
  });

  describe('createProjectMembership', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      projectMembershipRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created projectMembership', async () => {
      const cvId = 2;
      const createProjectMembershipDto: CreateProjectMembershipDto = {
        projectId: 1,
        description: '',
        startYear: 2000,
        startMonth: 1,
        endYear: 2004,
        endMonth: 12,
        highlight: false,
      };
      const projectMembership = await factory(ProjectMembership)().make({ ...createProjectMembershipDto, cvId });
      save.mockResolvedValue(projectMembership);

      expect(save).not.toHaveBeenCalled();
      const result = await projectMembershipRepository.createProjectMembership(cvId, createProjectMembershipDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(projectMembership);
    });
  });
});
