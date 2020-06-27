import { Test } from '@nestjs/testing';
import { CVRepository } from './cv.repository';
import { CV } from './cv.entity';
import { factory, useSeeding } from 'typeorm-seeding';

describe('CVRepository', () => {
  let cvRepository: any;

  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CVRepository,
      ],
    }).compile();

    cvRepository = module.get<CVRepository>(CVRepository);
  });

  describe('createCV', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      cvRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created cv', async () => {
      const cv = await factory(CV)().make({ userId: 1 });
      save.mockResolvedValue(cv);

      expect(save).not.toHaveBeenCalled();
      const result = await cvRepository.createCV(cv);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(cv);
    });
  });
});
