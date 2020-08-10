import { useSeeding, factory } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PatchProjectDto } from './dto/patch-project.dto';
import { Project } from './project.entity';

const mockProjectRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createProject: jest.fn(),
  save: jest.fn(),
});

describe('ProjectService', () => {
  let projectService: any;
  let projectRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: ProjectRepository, useFactory: mockProjectRepository },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
  });

  describe('findAll', () => {
    it('gets all companies from the repository', async () => {
      projectRepository.find.mockResolvedValue([]);

      expect(projectRepository.find).not.toHaveBeenCalled();
      const result = await projectService.findAll();
      expect(projectRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls projectRepository.findOne() and successfully retrieves and return project', async () => {
      const project = await factory(Project)().make();
      projectRepository.findOne.mockResolvedValue(project);

      const result = await projectService.findOne(1);
      expect(result).toEqual(project);

      expect(projectRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['company'],
      });
    });

    it('throws an error as project is not found', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(projectService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('calls projectRepository.delete(id) and deletes retrieves affected result', async () => {
      projectRepository.delete.mockResolvedValue({ affected: 1 });

      expect(projectRepository.delete).not.toHaveBeenCalled();
      await projectService.delete(1);
      expect(projectRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws an error if affected result is 0', async () => {
      projectRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(projectService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const getMany = jest.fn();

    beforeEach(async () => {
      projectRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getMany,
      }));
    });

    it('calls projectRepository.createProject(createProjectDto) and successfully retrieves and return project', async () => {
      const createProjectDto: CreateProjectDto = {
        companyId: 1,
        name: 'Metropolia',
      };
      const project = await factory(Project)().make(createProjectDto);
      projectRepository.createProject.mockResolvedValue(project);
      getMany.mockResolvedValue([]);

      expect(projectRepository.createProject).not.toHaveBeenCalled();
      const result = await projectService.create(createProjectDto);
      expect(result).toEqual(project);
      expect(projectRepository.createProject).toHaveBeenCalledWith(
        createProjectDto,
      );
    });
  });

  describe('patch', () => {
    it('finds project by id and updates it', async () => {
      const project = await factory(Project)().make({ id: 1 });
      const patchProjectDto: PatchProjectDto = { name: 'New project' };

      projectRepository.findOne.mockResolvedValue(project);
      projectRepository.save.mockResolvedValue({
        ...project,
        ...patchProjectDto,
      });

      expect(projectRepository.findOne).not.toHaveBeenCalled();
      expect(projectRepository.save).not.toHaveBeenCalled();
      const result = await projectService.patch(1, patchProjectDto);
      expect(result).toEqual({ ...project, ...patchProjectDto });
      expect(projectRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['company'],
      });
      expect(projectRepository.save).toHaveBeenCalledWith({
        ...project,
        ...patchProjectDto,
      });
    });

    it('throws an error as project is not found', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(projectService.patch(1, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
