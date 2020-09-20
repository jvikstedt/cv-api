import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { ProjectMembershipService } from './project-membership.service';
import { ProjectMembershipRepository } from './project-membership.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';
import { ProjectMembership } from './project-membership.entity';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';
import { CVService } from '../cv/cv.service';
import { SkillRepository } from '../skills/skill.repository';
import { Skill } from '../skills/skill.entity';

const mockProjectMembershipRepository = (): unknown => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createProjectMembership: jest.fn(),
  save: jest.fn(),
});

const mockCVService = (): unknown => ({
  reload: jest.fn(),
});

const mockSkillRepository = (): unknown => ({
  getOrCreateSkills: jest.fn(),
});

describe('ProjectMembershipService', () => {
  let projectMembershipsService: ProjectMembershipService;
  let cvService: CVService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let projectMembershipRepository: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skillRepository: any;

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
        {
          provide: SkillRepository,
          useFactory: mockSkillRepository,
        },
        { provide: CVService, useFactory: mockCVService },
      ],
    }).compile();

    projectMembershipsService = module.get<ProjectMembershipService>(
      ProjectMembershipService,
    );
    cvService = module.get<CVService>(CVService);
    projectMembershipRepository = module.get<ProjectMembershipRepository>(
      ProjectMembershipRepository,
    );
    skillRepository = module.get<SkillRepository>(SkillRepository);
  });

  describe('create', () => {
    describe('without skillSubjectIds', () => {
      it('creates a ProjectMembership without skills', async () => {
        // Initialize test data
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
          skillSubjectIds: [],
        };
        const projectMembership = await factory(ProjectMembership)().make({
          id: projectMembershipId,
          ...createProjectMembershipDto,
        });

        // Setup mock responses
        projectMembershipRepository.createProjectMembership.mockResolvedValue(
          projectMembership,
        );
        projectMembershipRepository.findOne.mockResolvedValue(
          projectMembership,
        );

        // Run the code and verify response
        const result = await projectMembershipsService.create(
          cvId,
          createProjectMembershipDto,
        );
        expect(result).toEqual(projectMembership);

        // Verify mocks were called
        expect(
          projectMembershipRepository.createProjectMembership,
        ).toHaveBeenCalledWith(cvId, createProjectMembershipDto, []);
        expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
          { cvId, id: projectMembershipId },
          {
            join: {
              alias: 'projectMembership',
              leftJoinAndSelect: {
                project: 'projectMembership.project',
                company: 'project.company',
                skill: 'projectMembership.skills',
                skillSubject: 'skill.skillSubject',
                skillGroup: 'skillSubject.skillGroup',
              },
            },
          },
        );
        expect(cvService.reload).toHaveBeenCalledWith(cvId);
        expect(skillRepository.getOrCreateSkills).not.toHaveBeenCalled();
      });
    });

    describe('with skillSubjectIds', () => {
      it('creates a ProjectMembership with skills', async () => {
        // Initialize test data
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
          skillSubjectIds: [1, 2],
        };
        const projectMembership = await factory(ProjectMembership)().make({
          id: projectMembershipId,
          ...createProjectMembershipDto,
        });

        const skill1 = await factory(Skill)().make({ skillSubjectId: 1 });
        const skill2 = await factory(Skill)().make({ skillSubjectId: 2 });

        // Setup mock responses
        skillRepository.getOrCreateSkills.mockResolvedValue([skill1, skill2]);

        projectMembershipRepository.createProjectMembership.mockResolvedValue(
          projectMembership,
        );
        projectMembershipRepository.findOne.mockResolvedValue(
          projectMembership,
        );

        // Run the code and verify response
        const result = await projectMembershipsService.create(
          cvId,
          createProjectMembershipDto,
        );
        expect(result).toEqual(projectMembership);

        // Verify mocks were called
        expect(
          projectMembershipRepository.createProjectMembership,
        ).toHaveBeenCalledWith(cvId, createProjectMembershipDto, [
          skill1,
          skill2,
        ]);
        expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
          { cvId, id: projectMembershipId },
          {
            join: {
              alias: 'projectMembership',
              leftJoinAndSelect: {
                project: 'projectMembership.project',
                company: 'project.company',
                skill: 'projectMembership.skills',
                skillSubject: 'skill.skillSubject',
                skillGroup: 'skillSubject.skillGroup',
              },
            },
          },
        );
        expect(cvService.reload).toHaveBeenCalledWith(cvId);
        expect(skillRepository.getOrCreateSkills).toHaveBeenCalledWith(
          cvId,
          createProjectMembershipDto.skillSubjectIds,
        );
      });
    });
  });

  describe('patch', () => {
    describe('without skillSubjectIds', () => {
      it('finds projectMembership by id and updates endYear', async () => {
        // Initialize test data
        const cvId = 2;
        const projectMembershipId = 1;
        const projectMembership = await factory(ProjectMembership)().make({
          id: projectMembershipId,
        });
        const patchProjectMembershipDto: PatchProjectMembershipDto = {
          endYear: 2020,
        };

        // Setup mock responses
        projectMembershipRepository.findOne.mockResolvedValueOnce(
          projectMembership,
        );
        projectMembershipRepository.findOne.mockResolvedValueOnce({
          ...projectMembership,
          ...patchProjectMembershipDto,
        });
        projectMembershipRepository.save.mockResolvedValue({
          ...projectMembership,
          ...patchProjectMembershipDto,
        });

        // Run the code and verify response
        const result = await projectMembershipsService.patch(
          cvId,
          projectMembershipId,
          patchProjectMembershipDto,
        );
        expect(result).toEqual({
          ...projectMembership,
          ...patchProjectMembershipDto,
        });

        // Verify mocks were called
        expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
          { cvId, id: projectMembershipId },
          {
            join: {
              alias: 'projectMembership',
              leftJoinAndSelect: {
                project: 'projectMembership.project',
                company: 'project.company',
                skill: 'projectMembership.skills',
                skillSubject: 'skill.skillSubject',
                skillGroup: 'skillSubject.skillGroup',
              },
            },
          },
        );
        expect(projectMembershipRepository.save).toHaveBeenCalledWith({
          ...projectMembership,
          ...patchProjectMembershipDto,
        });
        expect(cvService.reload).toHaveBeenCalledWith(cvId);
        expect(skillRepository.getOrCreateSkills).not.toHaveBeenCalled();
      });
    });

    describe('with skillSubjectIds', () => {
      it('finds projectMembership by id updates skills', async () => {
        // Initialize test data
        const cvId = 2;
        const projectMembershipId = 1;
        const projectMembership = await factory(ProjectMembership)().make({
          id: projectMembershipId,
        });
        const patchProjectMembershipDto: PatchProjectMembershipDto = {
          skillSubjectIds: [1, 2],
        };

        const skill1 = await factory(Skill)().make({ skillSubjectId: 1 });
        const skill2 = await factory(Skill)().make({ skillSubjectId: 2 });

        // Setup mock responses
        skillRepository.getOrCreateSkills.mockResolvedValue([skill1, skill2]);

        projectMembershipRepository.findOne.mockResolvedValueOnce(
          projectMembership,
        );
        projectMembershipRepository.findOne.mockResolvedValueOnce({
          ...projectMembership,
          ...patchProjectMembershipDto,
        });
        projectMembershipRepository.save.mockResolvedValue({
          ...projectMembership,
          ...patchProjectMembershipDto,
        });

        // Run the code and verify response
        const result = await projectMembershipsService.patch(
          cvId,
          projectMembershipId,
          patchProjectMembershipDto,
        );
        expect(result).toEqual({
          ...projectMembership,
          ...patchProjectMembershipDto,
        });

        // Verify mocks were called
        expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
          { cvId, id: projectMembershipId },
          {
            join: {
              alias: 'projectMembership',
              leftJoinAndSelect: {
                project: 'projectMembership.project',
                company: 'project.company',
                skill: 'projectMembership.skills',
                skillSubject: 'skill.skillSubject',
                skillGroup: 'skillSubject.skillGroup',
              },
            },
          },
        );
        expect(projectMembershipRepository.save).toHaveBeenCalledWith({
          ...projectMembership,
          ...patchProjectMembershipDto,
          skills: [skill1, skill2],
        });
        expect(cvService.reload).toHaveBeenCalledWith(cvId);
        expect(skillRepository.getOrCreateSkills).toHaveBeenCalledWith(
          cvId,
          patchProjectMembershipDto.skillSubjectIds,
        );
      });
    });
  });

  describe('findAll', () => {
    it('gets all projectMemberships from the repository', async () => {
      // Setup mock responses
      projectMembershipRepository.find.mockResolvedValue([]);

      // Run the code and verify response
      const result = await projectMembershipsService.findAll(1);
      expect(result).toEqual([]);

      // Verify mocks were called
      expect(projectMembershipRepository.find).toHaveBeenCalledWith({
        where: { cvId: 1 },
        join: {
          alias: 'projectMembership',
          leftJoinAndSelect: {
            project: 'projectMembership.project',
            company: 'project.company',
            skill: 'projectMembership.skills',
            skillSubject: 'skill.skillSubject',
            skillGroup: 'skillSubject.skillGroup',
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('calls projectMembershipRepository.findOne() and successfully retrieves and return projectMembership', async () => {
      // Initialize test data
      const cvId = 2;
      const projectMembershipId = 1;
      const projectMembership = await factory(ProjectMembership)().make();

      // Setup mock responses
      projectMembershipRepository.findOne.mockResolvedValue(projectMembership);

      // Run the code and verify response
      const result = await projectMembershipsService.findOne(
        cvId,
        projectMembershipId,
      );
      expect(result).toEqual(projectMembership);

      // Verify mocks were called
      expect(projectMembershipRepository.findOne).toHaveBeenCalledWith(
        { cvId, id: projectMembershipId },
        {
          join: {
            alias: 'projectMembership',
            leftJoinAndSelect: {
              project: 'projectMembership.project',
              company: 'project.company',
              skill: 'projectMembership.skills',
              skillSubject: 'skill.skillSubject',
              skillGroup: 'skillSubject.skillGroup',
            },
          },
        },
      );
    });

    it('throws an error as projectMembership is not found', async () => {
      projectMembershipRepository.findOne.mockResolvedValue(null);

      await expect(projectMembershipsService.findOne(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('calls projectMembershipRepository.delete(id) and deletes retrieves affected result', async () => {
      // Initialize test data
      const cvId = 2;
      const projectMembershipId = 1;
      const projectMembership = await factory(ProjectMembership)().make({
        cvId,
        id: projectMembershipId,
      });

      // Setup mock responses
      projectMembershipRepository.findOne.mockResolvedValue(projectMembership);

      // Run the code
      await projectMembershipsService.remove(cvId, projectMembershipId);

      // Verify mocks were called
      expect(projectMembershipRepository.delete).toHaveBeenCalledWith({
        cvId,
        id: projectMembershipId,
      });
      expect(cvService.reload).toHaveBeenCalledWith(cvId);
    });

    it('throws an error if affected result is 0', async () => {
      projectMembershipRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(projectMembershipsService.remove(2, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
