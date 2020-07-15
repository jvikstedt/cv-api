import { useSeeding, factory } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { SchoolsService } from './schools.service';
import { SchoolRepository } from './school.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { PatchSchoolDto } from './dto/patch-school.dto';
import { School } from './school.entity';

const mockSchoolRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createSchool: jest.fn(),
  save: jest.fn(),
});

describe('SchoolsService', () => {
  let schoolsService: any;
  let schoolRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SchoolsService,
        { provide: SchoolRepository, useFactory: mockSchoolRepository },
      ],
    }).compile();

    schoolsService = module.get<SchoolsService>(SchoolsService);
    schoolRepository = module.get<SchoolRepository>(SchoolRepository);
  });

  describe('findAll', () => {
    it('gets all schools from the repository', async () => {
      schoolRepository.find.mockResolvedValue([]);

      expect(schoolRepository.find).not.toHaveBeenCalled();
      const result = await schoolsService.findAll();
      expect(schoolRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls schoolRepository.findOne() and successfully retrieves and return school', async () => {
      const school = await factory(School)().make();
      schoolRepository.findOne.mockResolvedValue(school);

      const result = await schoolsService.findOne(1);
      expect(result).toEqual(school);

      expect(schoolRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('throws an error as school is not found', async () => {
      schoolRepository.findOne.mockResolvedValue(null);

      await expect(schoolsService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('calls schoolRepository.delete(id) and deletes retrieves affected result', async () => {
      schoolRepository.delete.mockResolvedValue({ affected: 1 });

      expect(schoolRepository.delete).not.toHaveBeenCalled();
      await schoolsService.delete(1);
      expect(schoolRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws an error if affected result is 0', async () => {
      schoolRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(schoolsService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const getMany = jest.fn();

    beforeEach(async () => {
      schoolRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getMany,
      }));
    });

    it('calls schoolRepository.createSchool(createSchoolDto) and successfully retrieves and return school', async () => {
      const createSchoolDto: CreateSchoolDto = { name: 'Metropolia' };
      const school = await factory(School)().make(createSchoolDto);
      schoolRepository.createSchool.mockResolvedValue(school);
      getMany.mockResolvedValue([]);

      expect(schoolRepository.createSchool).not.toHaveBeenCalled();
      const result = await schoolsService.create(createSchoolDto);
      expect(result).toEqual(school);
      expect(schoolRepository.createSchool).toHaveBeenCalledWith(createSchoolDto);
    });
  });

  describe('patch', () => {
    it('finds school by id and updates it', async () => {
      const school = await factory(School)().make({ id: 1 });
      const patchSchoolDto: PatchSchoolDto = { name: 'New school' };

      schoolRepository.findOne.mockResolvedValue(school);
      schoolRepository.save.mockResolvedValue({ ...school, ...patchSchoolDto });

      expect(schoolRepository.findOne).not.toHaveBeenCalled();
      expect(schoolRepository.save).not.toHaveBeenCalled();
      const result = await schoolsService.patch(1, patchSchoolDto);
      expect(result).toEqual({ ...school, ...patchSchoolDto });
      expect(schoolRepository.findOne).toHaveBeenCalledWith(1);
      expect(schoolRepository.save).toHaveBeenCalledWith({ ...school, ...patchSchoolDto });
    });

    it('throws an error as school is not found', async () => {
      schoolRepository.findOne.mockResolvedValue(null);

      await expect(schoolsService.patch(1, {})).rejects.toThrow(NotFoundException);
    });
  });
});
