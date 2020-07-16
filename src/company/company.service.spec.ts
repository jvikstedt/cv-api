import { useSeeding, factory } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PatchCompanyDto } from './dto/patch-company.dto';
import { Company } from './company.entity';

const mockCompanyRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createCompany: jest.fn(),
  save: jest.fn(),
});

describe('CompanyService', () => {
  let companyService: any;
  let companyRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: CompanyRepository, useFactory: mockCompanyRepository },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<CompanyRepository>(CompanyRepository);
  });

  describe('findAll', () => {
    it('gets all companies from the repository', async () => {
      companyRepository.find.mockResolvedValue([]);

      expect(companyRepository.find).not.toHaveBeenCalled();
      const result = await companyService.findAll();
      expect(companyRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls companyRepository.findOne() and successfully retrieves and return company', async () => {
      const company = await factory(Company)().make();
      companyRepository.findOne.mockResolvedValue(company);

      const result = await companyService.findOne(1);
      expect(result).toEqual(company);

      expect(companyRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('throws an error as company is not found', async () => {
      companyRepository.findOne.mockResolvedValue(null);

      await expect(companyService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('calls companyRepository.delete(id) and deletes retrieves affected result', async () => {
      companyRepository.delete.mockResolvedValue({ affected: 1 });

      expect(companyRepository.delete).not.toHaveBeenCalled();
      await companyService.delete(1);
      expect(companyRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws an error if affected result is 0', async () => {
      companyRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(companyService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const getMany = jest.fn();

    beforeEach(async () => {
      companyRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getMany,
      }));
    });

    it('calls companyRepository.createCompany(createCompanyDto) and successfully retrieves and return company', async () => {
      const createCompanyDto: CreateCompanyDto = { name: 'Metropolia' };
      const company = await factory(Company)().make(createCompanyDto);
      companyRepository.createCompany.mockResolvedValue(company);
      getMany.mockResolvedValue([]);

      expect(companyRepository.createCompany).not.toHaveBeenCalled();
      const result = await companyService.create(createCompanyDto);
      expect(result).toEqual(company);
      expect(companyRepository.createCompany).toHaveBeenCalledWith(createCompanyDto);
    });
  });

  describe('patch', () => {
    it('finds company by id and updates it', async () => {
      const company = await factory(Company)().make({ id: 1 });
      const patchCompanyDto: PatchCompanyDto = { name: 'New company' };

      companyRepository.findOne.mockResolvedValue(company);
      companyRepository.save.mockResolvedValue({ ...company, ...patchCompanyDto });

      expect(companyRepository.findOne).not.toHaveBeenCalled();
      expect(companyRepository.save).not.toHaveBeenCalled();
      const result = await companyService.patch(1, patchCompanyDto);
      expect(result).toEqual({ ...company, ...patchCompanyDto });
      expect(companyRepository.findOne).toHaveBeenCalledWith(1);
      expect(companyRepository.save).toHaveBeenCalledWith({ ...company, ...patchCompanyDto });
    });

    it('throws an error as company is not found', async () => {
      companyRepository.findOne.mockResolvedValue(null);

      await expect(companyService.patch(1, {})).rejects.toThrow(NotFoundException);
    });
  });
});
