import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { JobRepository } from './job.repository';
import { Job } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';

describe('JobRepository', () => {
  let jobRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JobRepository],
    }).compile();

    jobRepository = module.get<JobRepository>(JobRepository);
  });

  describe('createJob', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      jobRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created job', async () => {
      const createJobDto: CreateJobDto = {
        runner: 'SkillSubjectMerge',
        description: 'Vuejs -> Vue.js',

        data: {
          sourceId: 1,
          targetId: 2,
        },
      };
      const job = await factory(Job)().make(createJobDto);
      save.mockResolvedValue(job);

      expect(save).not.toHaveBeenCalled();
      const result = await jobRepository.createJob(1, createJobDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(job);
    });
  });
});
