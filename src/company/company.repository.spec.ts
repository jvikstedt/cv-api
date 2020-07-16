import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { CompanyRepository } from './company.repository';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

describe('CompanyRepository', () => {
  let companyRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyRepository,
      ],
    }).compile();

    companyRepository = module.get<CompanyRepository>(CompanyRepository);
  });

  describe('createCompany', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      companyRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created company', async () => {
      const createCompanyDto: CreateCompanyDto = { name: 'Metropolia' };
      const company = await factory(Company)().make(createCompanyDto);
      save.mockResolvedValue(company);

      expect(save).not.toHaveBeenCalled();
      const result = await companyRepository.createCompany(createCompanyDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(company);
    });
  });
});
