import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';
import {PatchCompanyDto} from './dto/patch-company.dto';

const mockCompanyService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('CompanyController', () => {
  let companyController: any;
  let companyService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [CompanyController],
      providers: [
        { provide: CompanyService, useFactory: mockCompanyService },
      ],
    })
    .compile();

    companyController = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const company = await factory(Company)().make();
      companyService.findAll.mockResolvedValue([company]);

      expect(companyService.findAll).not.toHaveBeenCalled();
      const result = await companyController.findAll();
      expect(companyService.findAll).toHaveBeenCalled();
      expect(result).toEqual([company]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const company = await factory(Company)().make();
      companyService.findOne.mockResolvedValue(company);

      expect(companyService.findOne).not.toHaveBeenCalled();
      const result = await companyController.findOne(1);
      expect(companyService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(company);
    });
  });

  describe('delete', () => {
    it('calls service delete with passed id', async () => {
      companyService.delete.mockResolvedValue();

      expect(companyService.delete).not.toHaveBeenCalled();
      await companyController.delete(1);
      expect(companyService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const company = await factory(Company)().make();
      companyService.create.mockResolvedValue(company);

      expect(companyService.create).not.toHaveBeenCalled();
      const result = await companyController.create({ name: company.name });
      expect(companyService.create).toHaveBeenCalledWith({ name: company.name });
      expect(result).toEqual(company);
    });
  });

  describe('patch', () => {
    it('calls service patch', async () => {
      const company = await factory(Company)().make({ id: 1, name: 'old company' });
      const patchCompanyDto: PatchCompanyDto = {
        name: 'new company',
      };

      companyService.patch.mockResolvedValue({ ...company, ...patchCompanyDto });

      expect(companyService.patch).not.toHaveBeenCalled();
      const result = await companyController.patch(1, patchCompanyDto);
      expect(companyService.patch).toHaveBeenCalledWith(1, patchCompanyDto);
      expect(result).toEqual({ ...company, ...patchCompanyDto });
    });
  });
});
