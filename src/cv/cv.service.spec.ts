import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { CVService } from './cv.service';
import { CVRepository } from './cv.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateCVDto } from './dto/create-cv.dto';
import { CV } from './cv.entity';
import { UpdateCVDto } from './dto/update-cv.dto';

const mockCVRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createCV: jest.fn(),
  save: jest.fn(),
});

describe('CVService', () => {
  let cvService: any;
  let cvRepository: any;

  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CVService,
        { provide: CVRepository, useFactory: mockCVRepository },
      ],
    }).compile();

    cvService = module.get<CVService>(CVService);
    cvRepository = module.get<CVRepository>(CVRepository);
  });

  describe('findAll', () => {
    it('gets all cv from the repository', async () => {
      cvRepository.find.mockResolvedValue([]);

      expect(cvRepository.find).not.toHaveBeenCalled();
      const result = await cvService.findAll();
      expect(cvRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls cvRepository.findOne() and successfully retrieves and return cv', async () => {
      const cv = await factory(CV)().make({ userId: 1 });
      cvRepository.findOne.mockResolvedValue(cv);

      const result = await cvService.findOne(1);
      expect(result).toEqual(cv);

      expect(cvRepository.findOne).toHaveBeenCalledWith(1, { relations: ['user'] });
    });

    it('throws an error as cv is not found', async () => {
      cvRepository.findOne.mockResolvedValue(null);

      await expect(cvService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('calls cvRepository.delete(id) and deletes retrieves affected result', async () => {
      cvRepository.delete.mockResolvedValue({ affected: 1 });

      expect(cvRepository.delete).not.toHaveBeenCalled();
      await cvService.delete(1);
      expect(cvRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws an error if affected result is 0', async () => {
      cvRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(cvService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('calls cvRepository.createCV(createCVDto) and successfully retrieves and return cv', async () => {
      const createCVDto: CreateCVDto = { userId: 1, description: 'Hello this is my CV' };
      const cv = await factory(CV)().make(createCVDto);
      cvRepository.createCV.mockResolvedValue(cv);

      expect(cvRepository.createCV).not.toHaveBeenCalled();
      const result = await cvService.create(createCVDto);
      expect(result).toEqual(cv);
      expect(cvRepository.createCV).toHaveBeenCalledWith(createCVDto);
    });
  });

  describe('update', () => {
    it('calls cvRepository.findOne(id) and cvRepository.save(cv) successfully retrieves and return cv', async () => {
      const updateCVDto: UpdateCVDto = { description: '' };
      const cv = await factory(CV)().make();
      cvRepository.findOne.mockResolvedValue(cv);
      cvRepository.save.mockResolvedValue({ ...cv, description: '' });

      expect(cvRepository.findOne).not.toHaveBeenCalled();
      expect(cvRepository.save).not.toHaveBeenCalled();
      const result = await cvService.update(1, updateCVDto);
      expect(result).toEqual({ ...cv, description: '' });
      expect(cvRepository.findOne).toHaveBeenCalledWith(1, { relations: ['user'] });
      expect(cvRepository.save).toHaveBeenCalledWith({ ...cv, description: '' });
    });

    it('throws an error as cv is not found', async () => {
      const updateCVDto: UpdateCVDto = { description: '' };
      cvRepository.findOne.mockResolvedValue(null);

      await expect(cvService.update(1, updateCVDto)).rejects.toThrow(NotFoundException);
    });
  });
});
