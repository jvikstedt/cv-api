import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { School } from './school.entity';
import {PatchSchoolDto} from './dto/patch-school.dto';

const mockSchoolsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('SchoolsController', () => {
  let schoolsController: any;
  let schoolsService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [SchoolsController],
      providers: [
        { provide: SchoolsService, useFactory: mockSchoolsService },
      ],
    })
    .compile();

    schoolsController = module.get<SchoolsController>(SchoolsController);
    schoolsService = module.get<SchoolsService>(SchoolsService);
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const school = await factory(School)().make();
      schoolsService.findAll.mockResolvedValue([school]);

      expect(schoolsService.findAll).not.toHaveBeenCalled();
      const result = await schoolsController.findAll();
      expect(schoolsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([school]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const school = await factory(School)().make();
      schoolsService.findOne.mockResolvedValue(school);

      expect(schoolsService.findOne).not.toHaveBeenCalled();
      const result = await schoolsController.findOne(1);
      expect(schoolsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(school);
    });
  });

  describe('delete', () => {
    it('calls service delete with passed id', async () => {
      schoolsService.delete.mockResolvedValue();

      expect(schoolsService.delete).not.toHaveBeenCalled();
      await schoolsController.delete(1);
      expect(schoolsService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const school = await factory(School)().make();
      schoolsService.create.mockResolvedValue(school);

      expect(schoolsService.create).not.toHaveBeenCalled();
      const result = await schoolsController.create({ name: school.name });
      expect(schoolsService.create).toHaveBeenCalledWith({ name: school.name });
      expect(result).toEqual(school);
    });
  });

  describe('patch', () => {
    it('calls service patch', async () => {
      const school = await factory(School)().make({ id: 1, name: 'old school' });
      const patchSchoolDto: PatchSchoolDto = {
        name: 'new school',
      };

      schoolsService.patch.mockResolvedValue({ ...school, ...patchSchoolDto });

      expect(schoolsService.patch).not.toHaveBeenCalled();
      const result = await schoolsController.patch(1, patchSchoolDto);
      expect(schoolsService.patch).toHaveBeenCalledWith(1, patchSchoolDto);
      expect(result).toEqual({ ...school, ...patchSchoolDto });
    });
  });
});
