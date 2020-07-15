import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { useSeeding, factory } from 'typeorm-seeding';
import { EducationsService } from './educations.service';
import { EducationRepository } from './education.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { Education } from './education.entity';
import { PatchEducationDto } from './dto/patch-education.dto';
import { QUEUE_NAME_CV } from '../constants';

const mockEducationRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createEducation: jest.fn(),
  save: jest.fn(),
});

const mockQueue = () => ({
  add: jest.fn(),
});

describe('EducationsService', () => {
  let educationsService: any;
  let educationRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EducationsService,
        { provide: EducationRepository, useFactory: mockEducationRepository },
        { provide: getQueueToken(QUEUE_NAME_CV), useFactory: mockQueue },
      ],
    }).compile();

    educationsService = module.get<EducationsService>(EducationsService);
    educationRepository = module.get<EducationRepository>(EducationRepository);
  });

  describe('create', () => {
    it('calls educationRepository.createEducation(createEducationDto) and successfully retrieves and return education', async () => {
      const cvId = 2;
      const educationId = 1;
      const createEducationDto: CreateEducationDto = {
        schoolId: 1,
        degree: "Bachelor's degree, Information Technology",
        fieldOfStudy: 'Computer Software Engineering',
        description: '',
        startYear: 2000,
        endYear: 2004
      };
      const education = await factory(Education)().make({ id: educationId, ...createEducationDto });
      educationRepository.createEducation.mockResolvedValue(education);
      educationRepository.findOne.mockResolvedValue(education);

      expect(educationRepository.createEducation).not.toHaveBeenCalled();
      expect(educationRepository.findOne).not.toHaveBeenCalled();
      const result = await educationsService.create(cvId, createEducationDto);
      expect(result).toEqual(education);
      expect(educationRepository.createEducation).toHaveBeenCalledWith(cvId, createEducationDto);
      expect(educationRepository.findOne).toHaveBeenCalledWith({ cvId, id: educationId }, { relations: ['school'] });
    });
  });

  describe('patch', () => {
    it('finds education by id and updates it', async () => {
      const cvId = 2;
      const educationId = 1;
      const education = await factory(Education)().make({ id: educationId });
      const patchEducationDto: PatchEducationDto = { endYear: 2020 };

      educationRepository.findOne.mockResolvedValue(education);
      educationRepository.save.mockResolvedValue({ ...education, ...patchEducationDto });

      expect(educationRepository.findOne).not.toHaveBeenCalled();
      expect(educationRepository.save).not.toHaveBeenCalled();
      const result = await educationsService.patch(cvId, educationId, patchEducationDto);
      expect(result).toEqual({ ...education, ...patchEducationDto });
      expect(educationRepository.findOne).toHaveBeenCalledWith({ cvId, id: educationId }, { relations: ['school'] });
      expect(educationRepository.save).toHaveBeenCalledWith({ ...education, ...patchEducationDto });
    });
  });

  describe('findAll', () => {
    it('gets all educations from the repository', async () => {
      educationRepository.find.mockResolvedValue([]);

      expect(educationRepository.find).not.toHaveBeenCalled();
      const result = await educationsService.findAll();
      expect(educationRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls educationRepository.findOne() and successfully retrieves and return education', async () => {
      const cvId = 2;
      const educationId = 1;
      const education = await factory(Education)().make();
      educationRepository.findOne.mockResolvedValue(education);

      const result = await educationsService.findOne(cvId, educationId);
      expect(result).toEqual(education);

      expect(educationRepository.findOne).toHaveBeenCalledWith({ cvId, id: educationId }, { relations: ['school'] });
    });

    it('throws an error as education is not found', async () => {
      educationRepository.findOne.mockResolvedValue(null);

      await expect(educationsService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('calls educationRepository.delete(id) and deletes retrieves affected result', async () => {
      const cvId = 2;
      const educationId = 1;
      const education = await factory(Education)().make({ cvId, id: educationId });
      educationRepository.findOne.mockResolvedValue(education);

      expect(educationRepository.delete).not.toHaveBeenCalled();
      await educationsService.remove(cvId, educationId);
      expect(educationRepository.delete).toHaveBeenCalledWith({ cvId, id: educationId });
    });

    it('throws an error if affected result is 0', async () => {
      educationRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(educationsService.remove(2, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
