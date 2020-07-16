import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { WorkExperienceRepository } from './work-experience.repository';
import { WorkExperience } from './work-experience.entity';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';

describe('WorkExperienceRepository', () => {
  let workExperienceRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkExperienceRepository,
      ],
    }).compile();

    workExperienceRepository = module.get<WorkExperienceRepository>(WorkExperienceRepository);
  });

  describe('createWorkExperience', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      workExperienceRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created workExperience', async () => {
      const cvId = 2;
      const createWorkExperienceDto: CreateWorkExperienceDto = {
        companyId: 1,
        jobTitle: 'Developer',
        description: '',
        startYear: 2000,
        startMonth: 1,
        endYear: 2004,
        endMonth: 12,
      };
      const workExperience = await factory(WorkExperience)().make({ ...createWorkExperienceDto, cvId });
      save.mockResolvedValue(workExperience);

      expect(save).not.toHaveBeenCalled();
      const result = await workExperienceRepository.createWorkExperience(cvId, createWorkExperienceDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(workExperience);
    });
  });
});
