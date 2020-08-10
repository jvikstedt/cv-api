import { Test } from '@nestjs/testing';
import { factory, useSeeding } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { CVService } from './cv.service';
import { CVController } from './cv.controller';
import { CV } from './cv.entity';
import { PatchCVDto } from './dto/patch-cv.dto';
import { SearchCVDto } from './dto/search-cv.dto';

const mockCVService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  patch: jest.fn(),
  search: jest.fn(),
});

describe('CVController', () => {
  let cvController: any;
  let cvService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [CVController],
      providers: [{ provide: CVService, useFactory: mockCVService }],
    }).compile();

    cvController = module.get<CVController>(CVController);
    cvService = module.get<CVService>(CVService);
  });

  describe('patch', () => {
    it('calls service patch', async () => {
      const cv = await factory(CV)().make({ id: 1, description: 'old text' });
      const patchCVDto: PatchCVDto = {
        description: 'new text',
      };

      cvService.patch.mockResolvedValue({ ...cv, ...patchCVDto });

      expect(cvService.patch).not.toHaveBeenCalled();
      const result = await cvController.patch(1, patchCVDto);
      expect(cvService.patch).toHaveBeenCalledWith(1, patchCVDto);
      expect(result).toEqual({ ...cv, ...patchCVDto });
    });
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const cv = await factory(CV)().make();

      cvService.findAll.mockResolvedValue([cv]);

      expect(cvService.findAll).not.toHaveBeenCalled();
      const result = await cvController.findAll();
      expect(cvService.findAll).toHaveBeenCalled();
      expect(result).toEqual([cv]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const cv = await factory(CV)().make();
      cvService.findOne.mockResolvedValue(cv);

      expect(cvService.findOne).not.toHaveBeenCalled();
      const result = await cvController.findOne(1);
      expect(cvService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(cv);
    });
  });

  describe('search', () => {
    it('calls service search with search params', async () => {
      const cv = await factory(CV)().make();
      cvService.search.mockResolvedValue([cv]);

      const searchCVDto: SearchCVDto = {
        fullName: 'john',
      };

      expect(cvService.search).not.toHaveBeenCalled();
      const result = await cvController.search(searchCVDto);
      expect(cvService.search).toHaveBeenCalledWith(searchCVDto);
      expect(result).toEqual([cv]);
    });
  });
});
