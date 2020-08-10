import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { EducationRepository } from './education.repository';
import { Education } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';

describe('EducationRepository', () => {
  let educationRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EducationRepository],
    }).compile();

    educationRepository = module.get<EducationRepository>(EducationRepository);
  });

  describe('createEducation', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      educationRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created education', async () => {
      const cvId = 2;
      const createEducationDto: CreateEducationDto = {
        schoolId: 1,
        degree: "Bachelor's degree, Information Technology",
        fieldOfStudy: 'Computer Software Engineering',
        description: '',
        startYear: 2000,
        endYear: 2004,
        highlight: false,
      };
      const education = await factory(Education)().make({
        ...createEducationDto,
        cvId,
      });
      save.mockResolvedValue(education);

      expect(save).not.toHaveBeenCalled();
      const result = await educationRepository.createEducation(
        cvId,
        createEducationDto,
      );
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(education);
    });
  });
});
