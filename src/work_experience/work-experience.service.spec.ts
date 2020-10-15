import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperienceRepository } from './work-experience.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { WorkExperience } from './work-experience.entity';
import { PatchWorkExperienceDto } from './dto/patch-work-experience.dto';
import { CVService } from '../cv/cv.service';

const mockWorkExperienceRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createWorkExperience: jest.fn(),
  save: jest.fn(),
});

const mockCVService = () => ({
  reload: jest.fn(),
});

describe('WorkExperienceService', () => {
  let workExperiencesService: any;
  let workExperienceRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkExperienceService,
        {
          provide: WorkExperienceRepository,
          useFactory: mockWorkExperienceRepository,
        },
        { provide: CVService, useFactory: mockCVService },
      ],
    }).compile();

    workExperiencesService = module.get<WorkExperienceService>(
      WorkExperienceService,
    );
    workExperienceRepository = module.get<WorkExperienceRepository>(
      WorkExperienceRepository,
    );
  });

  describe('create', () => {
    it('calls workExperienceRepository.createWorkExperience(createWorkExperienceDto) and successfully retrieves and return workExperience', async () => {
      const cvId = 2;
      const workExperienceId = 1;
      const createWorkExperienceDto: CreateWorkExperienceDto = {
        companyId: 1,
        jobTitle: 'Developer',
        description: '',
        startYear: 2000,
        startMonth: 1,
        endYear: 2004,
        endMonth: 12,
        highlight: false,
      };
      const workExperience = await factory(WorkExperience)().make({
        id: workExperienceId,
        ...createWorkExperienceDto,
      });
      workExperienceRepository.createWorkExperience.mockResolvedValue(
        workExperience,
      );
      workExperienceRepository.findOne.mockResolvedValue(workExperience);

      expect(
        workExperienceRepository.createWorkExperience,
      ).not.toHaveBeenCalled();
      expect(workExperienceRepository.findOne).not.toHaveBeenCalled();
      const result = await workExperiencesService.create(
        cvId,
        createWorkExperienceDto,
      );
      expect(result).toEqual(workExperience);
      expect(
        workExperienceRepository.createWorkExperience,
      ).toHaveBeenCalledWith(cvId, createWorkExperienceDto);
      expect(workExperienceRepository.findOne).toHaveBeenCalledWith(
        { cvId, id: workExperienceId },
        { relations: ['company'] },
      );
    });
  });

  describe('patch', () => {
    it('finds workExperience by id and updates it', async () => {
      const cvId = 2;
      const workExperienceId = 1;
      const workExperience = await factory(WorkExperience)().make({
        id: workExperienceId,
      });
      const patchWorkExperienceDto: PatchWorkExperienceDto = { endYear: 2020 };

      workExperienceRepository.findOne.mockResolvedValue(workExperience);
      workExperienceRepository.save.mockResolvedValue({
        ...workExperience,
        ...patchWorkExperienceDto,
      });

      expect(workExperienceRepository.findOne).not.toHaveBeenCalled();
      expect(workExperienceRepository.save).not.toHaveBeenCalled();
      const result = await workExperiencesService.patch(
        cvId,
        workExperienceId,
        patchWorkExperienceDto,
      );
      expect(result).toEqual({ ...workExperience, ...patchWorkExperienceDto });
      expect(workExperienceRepository.findOne).toHaveBeenCalledWith(
        { cvId, id: workExperienceId },
        { relations: ['company'] },
      );
      expect(workExperienceRepository.save).toHaveBeenCalledWith({
        ...workExperience,
        ...patchWorkExperienceDto,
      });
    });
  });

  describe('findAll', () => {
    it('gets all workExperiences from the repository', async () => {
      workExperienceRepository.find.mockResolvedValue([]);

      expect(workExperienceRepository.find).not.toHaveBeenCalled();
      const result = await workExperiencesService.findAll();
      expect(workExperienceRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls workExperienceRepository.findOne() and successfully retrieves and return workExperience', async () => {
      const cvId = 2;
      const workExperienceId = 1;
      const workExperience = await factory(WorkExperience)().make();
      workExperienceRepository.findOne.mockResolvedValue(workExperience);

      const result = await workExperiencesService.findOne(
        cvId,
        workExperienceId,
      );
      expect(result).toEqual(workExperience);

      expect(workExperienceRepository.findOne).toHaveBeenCalledWith(
        { cvId, id: workExperienceId },
        { relations: ['company'] },
      );
    });

    it('throws an error as workExperience is not found', async () => {
      workExperienceRepository.findOne.mockResolvedValue(null);

      await expect(workExperiencesService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('calls workExperienceRepository.delete(id) and deletes retrieves affected result', async () => {
      const cvId = 2;
      const workExperienceId = 1;
      const workExperience = await factory(WorkExperience)().make({
        cvId,
        id: workExperienceId,
      });
      workExperienceRepository.findOne.mockResolvedValue(workExperience);

      expect(workExperienceRepository.delete).not.toHaveBeenCalled();
      await workExperiencesService.remove(cvId, workExperienceId);
      expect(workExperienceRepository.delete).toHaveBeenCalledWith({
        cvId,
        id: workExperienceId,
      });
    });

    it('throws an error if affected result is 0', async () => {
      workExperienceRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(workExperiencesService.remove(2, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
