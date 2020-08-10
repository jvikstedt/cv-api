import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { useSeeding, factory } from 'typeorm-seeding';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CVService } from './cv.service';
import { CVRepository } from './cv.repository';
import { NotFoundException } from '@nestjs/common';
import { CV } from './cv.entity';
import { SearchCVDto } from './dto/search-cv.dto';
import { PatchCVDto } from './dto/patch-cv.dto';
import { QUEUE_NAME_CV } from '../constants';

const mockCVRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockElasticSearch = () => ({
  search: jest.fn(),
});

const mockQueue = () => ({
  add: jest.fn(),
});

describe('CVService', () => {
  let cvService: any;
  let cvRepository: any;
  let elasticsearch: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CVService,
        { provide: CVRepository, useFactory: mockCVRepository },
        { provide: ElasticsearchService, useFactory: mockElasticSearch },
        { provide: getQueueToken(QUEUE_NAME_CV), useFactory: mockQueue },
      ],
    }).compile();

    cvService = module.get<CVService>(CVService);
    cvRepository = module.get<CVRepository>(CVRepository);
    elasticsearch = module.get<ElasticsearchService>(ElasticsearchService);
  });

  describe('patch', () => {
    it('finds cv by id and updates it', async () => {
      const cv = await factory(CV)().make({ id: 1 });
      const patchCVDto: PatchCVDto = { description: 'new text' };

      cvRepository.findOne.mockResolvedValue(cv);
      cvRepository.save.mockResolvedValue({ ...cv, ...patchCVDto });

      expect(cvRepository.findOne).not.toHaveBeenCalled();
      expect(cvRepository.save).not.toHaveBeenCalled();
      const result = await cvService.patch(1, patchCVDto);
      expect(result).toEqual({ ...cv, ...patchCVDto });
      expect(cvRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['user'],
      });
      expect(cvRepository.save).toHaveBeenCalledWith({ ...cv, ...patchCVDto });
    });
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

      expect(cvRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['user'],
      });
    });

    it('throws an error as cv is not found', async () => {
      cvRepository.findOne.mockResolvedValue(null);

      await expect(cvService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('calls elasticsearchService(searchCVDto) and successfully retrieves cvs', async () => {
      const searchCVDto: SearchCVDto = new SearchCVDto();
      searchCVDto.fullName = 'john';

      elasticsearch.search.mockResolvedValue({
        statusCode: 200,
        body: {
          hits: {
            hits: [{ _source: { name: 'john' } }],
          },
        },
      });

      expect(elasticsearch.search).not.toHaveBeenCalled();
      const result = await cvService.search(searchCVDto);
      expect(result).toEqual([{ name: 'john' }]);
      expect(elasticsearch.search).toHaveBeenCalled();
    });
  });
});
