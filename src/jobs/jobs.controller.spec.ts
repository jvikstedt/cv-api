import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';

const mockJobsService = () => ({
  findAll: jest.fn(),
  cancel: jest.fn(),
  approve: jest.fn(),
  reject: jest.fn(),
  create: jest.fn(),
});

describe('JobsController', () => {
  let jobsController: any;
  let jobsService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [JobsController],
      providers: [{ provide: JobsService, useFactory: mockJobsService }],
    }).compile();

    jobsController = module.get<JobsController>(JobsController);
    jobsService = module.get<JobsService>(JobsService);
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const job = await factory(Job)().make();
      jobsService.findAll.mockResolvedValue([job]);

      expect(jobsService.findAll).not.toHaveBeenCalled();
      const result = await jobsController.findAll();
      expect(jobsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([job]);
    });
  });

  describe('delete', () => {
    it('calls service delete with passed id', async () => {
      const job = await factory(Job)().make();
      jobsService.cancel.mockResolvedValue(job);

      expect(jobsService.cancel).not.toHaveBeenCalled();
      const result = await jobsController.delete(1);
      expect(jobsService.cancel).toHaveBeenCalledWith(1);
      expect(result).toEqual(job);
    });
  });

  describe('approve', () => {
    it('calls service approve with passed id', async () => {
      const job = await factory(Job)().make();
      jobsService.approve.mockResolvedValue(job);

      expect(jobsService.approve).not.toHaveBeenCalled();
      const result = await jobsController.approve(1);
      expect(jobsService.approve).toHaveBeenCalledWith(1);
      expect(result).toEqual(job);
    });
  });

  describe('reject', () => {
    it('calls service reject with passed id', async () => {
      const job = await factory(Job)().make();
      jobsService.reject.mockResolvedValue(job);

      expect(jobsService.reject).not.toHaveBeenCalled();
      const result = await jobsController.reject(1);
      expect(jobsService.reject).toHaveBeenCalledWith(1);
      expect(result).toEqual(job);
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const job = await factory(Job)().make();
      jobsService.create.mockResolvedValue(job);

      const createJobDto: CreateJobDto = {
        runner: 'SkillSubjectMerge',
        description: 'Vuejs -> Vue.js',

        data: {
          sourceId: 1,
          targetId: 2,
        },
      };

      expect(jobsService.create).not.toHaveBeenCalled();
      const result = await jobsController.create({}, createJobDto);
      expect(jobsService.create).toHaveBeenCalledWith({}, createJobDto);
      expect(result).toEqual(job);
    });
  });
});
