import { Test } from '@nestjs/testing';
import { factory, useSeeding } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { CVService } from './cv.service';
import { CVController } from './cv.controller';
import { CV } from './cv.entity';

const mockCVService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('CVController', () => {
  let cvController: any;
  let cvService: any;

  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [CVController],
      providers: [
        { provide: CVService, useFactory: mockCVService },
      ],
    })
    .compile();

    cvController = module.get<CVController>(CVController);
    cvService = module.get<CVService>(CVService);
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
});
