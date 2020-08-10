import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { ProjectMembershipService } from './project-membership.service';
import { ProjectMembershipController } from './project-membership.controller';
import { ProjectMembership } from './project-membership.entity';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';

const mockProjectMembershipService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('ProjectMembershipController', () => {
  let projectMembershipController: any;
  let projectMembershipService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ProjectMembershipController],
      providers: [
        {
          provide: ProjectMembershipService,
          useFactory: mockProjectMembershipService,
        },
      ],
    }).compile();

    projectMembershipController = module.get<ProjectMembershipController>(
      ProjectMembershipController,
    );
    projectMembershipService = module.get<ProjectMembershipService>(
      ProjectMembershipService,
    );
  });

  describe('patch', () => {
    it('calls service patch with passed data', async () => {
      const cvId = 2;
      const projectMembershipId = 1;
      const patchProjectMembershipDto: PatchProjectMembershipDto = {
        endYear: 2020,
      };
      const oldProjectMembership = await factory(ProjectMembership)().make({
        id: projectMembershipId,
        endYear: 2019,
      });
      projectMembershipService.patch.mockResolvedValue({
        ...oldProjectMembership,
        ...patchProjectMembershipDto,
      });

      expect(projectMembershipService.patch).not.toHaveBeenCalled();
      const result = await projectMembershipController.patch(
        cvId,
        projectMembershipId,
        patchProjectMembershipDto,
      );
      expect(projectMembershipService.patch).toHaveBeenCalledWith(
        cvId,
        projectMembershipId,
        patchProjectMembershipDto,
      );
      expect(result).toEqual({
        ...oldProjectMembership,
        ...patchProjectMembershipDto,
      });
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
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
      const projectMembership = await factory(ProjectMembership)().make(
        createProjectMembershipDto,
      );
      projectMembershipService.create.mockResolvedValue(projectMembership);

      expect(projectMembershipService.create).not.toHaveBeenCalled();
      const result = await projectMembershipController.create(
        cvId,
        createProjectMembershipDto,
      );
      expect(projectMembershipService.create).toHaveBeenCalledWith(
        cvId,
        createProjectMembershipDto,
      );
      expect(result).toEqual(projectMembership);
    });
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const projectMembership = await factory(ProjectMembership)().make();
      projectMembershipService.findAll.mockResolvedValue([projectMembership]);

      expect(projectMembershipService.findAll).not.toHaveBeenCalled();
      const result = await projectMembershipController.findAll();
      expect(projectMembershipService.findAll).toHaveBeenCalled();
      expect(result).toEqual([projectMembership]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const cvId = 2;
      const projectMembershipId = 1;
      const projectMembership = await factory(ProjectMembership)().make();
      projectMembershipService.findOne.mockResolvedValue(projectMembership);

      expect(projectMembershipService.findOne).not.toHaveBeenCalled();
      const result = await projectMembershipController.findOne(
        cvId,
        projectMembershipId,
      );
      expect(projectMembershipService.findOne).toHaveBeenCalledWith(
        cvId,
        projectMembershipId,
      );
      expect(result).toEqual(projectMembership);
    });
  });

  describe('remove', () => {
    it('calls service remove with passed id', async () => {
      const cvId = 2;
      const projectMembershipId = 1;
      projectMembershipService.remove.mockResolvedValue();

      expect(projectMembershipService.remove).not.toHaveBeenCalled();
      await projectMembershipController.remove(cvId, projectMembershipId);
      expect(projectMembershipService.remove).toHaveBeenCalledWith(
        cvId,
        projectMembershipId,
      );
    });
  });
});
