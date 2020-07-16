import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './project.entity';
import { PatchProjectDto } from './dto/patch-project.dto';

const mockProjectService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('ProjectController', () => {
  let projectController: any;
  let projectService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [ProjectController],
      providers: [
        { provide: ProjectService, useFactory: mockProjectService },
      ],
    })
    .compile();

    projectController = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const project = await factory(Project)().make();
      projectService.findAll.mockResolvedValue([project]);

      expect(projectService.findAll).not.toHaveBeenCalled();
      const result = await projectController.findAll();
      expect(projectService.findAll).toHaveBeenCalled();
      expect(result).toEqual([project]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const project = await factory(Project)().make();
      projectService.findOne.mockResolvedValue(project);

      expect(projectService.findOne).not.toHaveBeenCalled();
      const result = await projectController.findOne(1);
      expect(projectService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(project);
    });
  });

  describe('delete', () => {
    it('calls service delete with passed id', async () => {
      projectService.delete.mockResolvedValue();

      expect(projectService.delete).not.toHaveBeenCalled();
      await projectController.delete(1);
      expect(projectService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const project = await factory(Project)().make();
      projectService.create.mockResolvedValue(project);

      expect(projectService.create).not.toHaveBeenCalled();
      const result = await projectController.create({ name: project.name });
      expect(projectService.create).toHaveBeenCalledWith({ name: project.name });
      expect(result).toEqual(project);
    });
  });

  describe('patch', () => {
    it('calls service patch', async () => {
      const project = await factory(Project)().make({ id: 1, name: 'old project' });
      const patchProjectDto: PatchProjectDto = {
        name: 'new project',
      };

      projectService.patch.mockResolvedValue({ ...project, ...patchProjectDto });

      expect(projectService.patch).not.toHaveBeenCalled();
      const result = await projectController.patch(1, patchProjectDto);
      expect(projectService.patch).toHaveBeenCalledWith(1, patchProjectDto);
      expect(result).toEqual({ ...project, ...patchProjectDto });
    });
  });
});
