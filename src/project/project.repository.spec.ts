import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

describe('ProjectRepository', () => {
  let projectRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectRepository,
      ],
    }).compile();

    projectRepository = module.get<ProjectRepository>(ProjectRepository);
  });

  describe('createProject', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      projectRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created project', async () => {
      const createProjectDto: CreateProjectDto = { companyId: 1, name: 'Metropolia' };
      const project = await factory(Project)().make(createProjectDto);
      save.mockResolvedValue(project);

      expect(save).not.toHaveBeenCalled();
      const result = await projectRepository.createProject(createProjectDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(project);
    });
  });
});
