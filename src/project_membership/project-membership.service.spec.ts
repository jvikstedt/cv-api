import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { ProjectMembershipService } from './project-membership.service';
import { ProjectMembershipRepository } from './project-membership.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';
import { ProjectMembership } from './project-membership.entity';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';
import { CVService } from '../cv/cv.service';

const mockProjectMembershipRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createProjectMembership: jest.fn(),
  save: jest.fn(),
});

const mockCVService = () => ({
  reload: jest.fn(),
});

describe('ProjectMembershipService', () => {
  let projectMembershipsService: any;
  let projectMembershipRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectMembershipService,
        {
          provide: ProjectMembershipRepository,
          useFactory: mockProjectMembershipRepository,
        },
        { provide: CVService, useFactory: mockCVService },
      ],
    }).compile();

    projectMembershipsService = module.get<ProjectMembershipService>(
      ProjectMembershipService,
    );
    projectMembershipRepository = module.get<ProjectMembershipRepository>(
      ProjectMembershipRepository,
    );
  });

  describe('create', () => {
    it('calls projectMembershipRepository.createProjectMembership(createProjectMembershipDto) and successfully retrieves and return projectMembership', async () => {
      const cvId = 2;
      const projectMembershipId = 1;
      const createProjectMembershipDto: CreateProjectMembershipDto = {
        projectId: 1,
        description: '',
        startYear: 2000,
        startMonth: 1,
        endYear: 2004,
        endMonth: 12,
        highlight: false,
      };
      const projectMembership = await factory(ProjectMembership)().make({
        id: projectMembershipId,
        ...createProjectMembershipDto,
      });
      projectMembershipRepository.createProjectMembership.mockResolvedValue(
        projectMembership,
      );
      projectMembershipRepository.findOne.mockResolvedValue(projectMembership);

      expect(
        projectMembershipRepository.createProjectMembership,
      ).not.toHaveBeenCalled();
      expect(projectMembershipRepository.findOne).not.toHaveBeenCalled();
      const result = await projectMembershipsService.create(
        cvId,
        createProjectMembershipDto,
      );
      expect(result).toEqual(projectMembership);
      expect(
        projectMembershipRepository.createProjectMembership,
      ).toHaveBeenCalledWith(cvId, createProjectMembershipDto);
      expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
        { cvId, id: projectMembershipId },
        { relations: ['project', 'project.company'] },
      );
    });
  });

  describe('patch', () => {
    it('finds projectMembership by id and updates it', async () => {
      const cvId = 2;
      const projectMembershipId = 1;
      const projectMembership = await factory(ProjectMembership)().make({
        id: projectMembershipId,
      });
      const patchProjectMembershipDto: PatchProjectMembershipDto = {
        endYear: 2020,
      };

      projectMembershipRepository.findOne.mockResolvedValue(projectMembership);
      projectMembershipRepository.save.mockResolvedValue({
        ...projectMembership,
        ...patchProjectMembershipDto,
      });

      expect(projectMembershipRepository.findOne).not.toHaveBeenCalled();
      expect(projectMembershipRepository.save).not.toHaveBeenCalled();
      const result = await projectMembershipsService.patch(
        cvId,
        projectMembershipId,
        patchProjectMembershipDto,
      );
      expect(result).toEqual({
        ...projectMembership,
        ...patchProjectMembershipDto,
      });
      expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
        { cvId, id: projectMembershipId },
        { relations: ['project', 'project.company'] },
      );
      expect(projectMembershipRepository.save).toHaveBeenCalledWith({
        ...projectMembership,
        ...patchProjectMembershipDto,
      });
    });
  });

  describe('findAll', () => {
    it('gets all projectMemberships from the repository', async () => {
      projectMembershipRepository.find.mockResolvedValue([]);

      expect(projectMembershipRepository.find).not.toHaveBeenCalled();
      const result = await projectMembershipsService.findAll();
      expect(projectMembershipRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls projectMembershipRepository.findOne() and successfully retrieves and return projectMembership', async () => {
      const cvId = 2;
      const projectMembershipId = 1;
      const projectMembership = await factory(ProjectMembership)().make();
      projectMembershipRepository.findOne.mockResolvedValue(projectMembership);

      const result = await projectMembershipsService.findOne(
        cvId,
        projectMembershipId,
      );
      expect(result).toEqual(projectMembership);

      expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
        { cvId, id: projectMembershipId },
        { relations: ['project', 'project.company'] },
      );
    });

    it('throws an error as projectMembership is not found', async () => {
      projectMembershipRepository.findOne.mockResolvedValue(null);

      await expect(projectMembershipsService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('calls projectMembershipRepository.delete(id) and deletes retrieves affected result', async () => {
      const cvId = 2;
      const projectMembershipId = 1;
      const projectMembership = await factory(ProjectMembership)().make({
        cvId,
        id: projectMembershipId,
      });
      projectMembershipRepository.findOne.mockResolvedValue(projectMembership);

      expect(projectMembershipRepository.delete).not.toHaveBeenCalled();
      await projectMembershipsService.remove(cvId, projectMembershipId);
      expect(projectMembershipRepository.delete).toHaveBeenCalledWith({
        cvId,
        id: projectMembershipId,
      });
    });

    it('throws an error if affected result is 0', async () => {
      projectMembershipRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(projectMembershipsService.remove(2, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
