import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SchoolRepository } from './school.repository';
import { School } from './school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';

describe('SchoolRepository', () => {
  let schoolRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SchoolRepository],
    }).compile();

    schoolRepository = module.get<SchoolRepository>(SchoolRepository);
  });

  describe('createSchool', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      schoolRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created school', async () => {
      const createSchoolDto: CreateSchoolDto = { name: 'Metropolia' };
      const school = await factory(School)().make(createSchoolDto);
      save.mockResolvedValue(school);

      expect(save).not.toHaveBeenCalled();
      const result = await schoolRepository.createSchool(createSchoolDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(school);
    });
  });
});
