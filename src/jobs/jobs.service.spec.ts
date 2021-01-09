import { useSeeding, factory } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { JobRepository } from './job.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, State } from './job.entity';
import { QUEUE_NAME_JOB } from '../constants';
import { getQueueToken } from '@nestjs/bull';
import { JwtPayload } from '../auth/jwt-payload.interface';

const mockJobRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createJob: jest.fn(),
  save: jest.fn(),
});

const mockQueue = () => ({
  add: jest.fn(),
});

describe('JobsService', () => {
  let jobsService: any;
  let jobRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: JobRepository, useFactory: mockJobRepository },
        { provide: getQueueToken(QUEUE_NAME_JOB), useFactory: mockQueue },
      ],
    }).compile();

    jobsService = module.get<JobsService>(JobsService);
    jobRepository = module.get<JobRepository>(JobRepository);
  });

  describe('findAll', () => {
    describe('admin user', () => {
      it('gets all jobs from the repository', async () => {
        const jwtPayload: JwtPayload = {
          userId: 1,
          username: 'foo.bar@gmail.com',
          firstName: 'foo',
          lastName: 'bar',
          cvIds: [1],
          roles: ['ADMIN'],
        };
        const job = await factory(Job)().make();
        jobRepository.find.mockResolvedValue([job]);

        expect(jobRepository.find).not.toHaveBeenCalled();
        const result = await jobsService.findAll(jwtPayload);
        expect(jobRepository.find).toHaveBeenCalledWith({
          relations: ['user'],
        });
        expect(result).toEqual([job]);
      });
    });
    describe('normal user', () => {
      it('gets only jobs created by user', async () => {
        const jwtPayload: JwtPayload = {
          userId: 1,
          username: 'foo.bar@gmail.com',
          firstName: 'foo',
          lastName: 'bar',
          cvIds: [1],
          roles: [],
        };
        const job = await factory(Job)().make();
        jobRepository.find.mockResolvedValue([job]);

        expect(jobRepository.find).not.toHaveBeenCalled();
        const result = await jobsService.findAll(jwtPayload);
        expect(jobRepository.find).toHaveBeenCalledWith({
          where: {
            userId: jwtPayload.userId,
          },
          relations: ['user'],
        });
        expect(result).toEqual([job]);
      });
    });
  });

  describe('findOne', () => {
    it('calls jobRepository.findOne() and successfully retrieves and return job', async () => {
      const job = await factory(Job)().make();
      jobRepository.findOne.mockResolvedValue(job);

      const result = await jobsService.findOne(1);
      expect(result).toEqual(job);

      expect(jobRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['user'],
      });
    });

    it('throws an error as job is not found', async () => {
      jobRepository.findOne.mockResolvedValue(null);

      await expect(jobsService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('calls jobRepository.save with cancelled state', async () => {
      const job = await factory(Job)().make();
      jobRepository.findOne.mockResolvedValue(job);
      jobRepository.save.mockResolvedValue();

      expect(jobRepository.save).not.toHaveBeenCalled();
      await jobsService.cancel(1);
      expect(jobRepository.save).toHaveBeenCalledWith({
        ...job,
        state: State.Cancelled,
      });
    });

    it('throws an error if state is not pending', async () => {
      const job = await factory(Job)().make({ state: State.Cancelled });
      jobRepository.findOne.mockResolvedValue(job);

      await expect(jobsService.cancel(1)).rejects.toThrow(BadRequestException);
      expect(jobRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('approve', () => {
    it('calls jobRepository.save with approved state', async () => {
      const job = await factory(Job)().make();
      jobRepository.findOne.mockResolvedValue(job);
      jobRepository.save.mockResolvedValue();

      expect(jobRepository.save).not.toHaveBeenCalled();
      await jobsService.approve(1);
      expect(jobRepository.save).toHaveBeenCalledWith({
        ...job,
        state: State.Approved,
      });
    });

    it('throws an error if state is not pending', async () => {
      const job = await factory(Job)().make({ state: State.Cancelled });
      jobRepository.findOne.mockResolvedValue(job);

      await expect(jobsService.approve(1)).rejects.toThrow(BadRequestException);
      expect(jobRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('reject', () => {
    it('calls jobRepository.save with rejected state', async () => {
      const job = await factory(Job)().make();
      jobRepository.findOne.mockResolvedValue(job);
      jobRepository.save.mockResolvedValue();

      expect(jobRepository.save).not.toHaveBeenCalled();
      await jobsService.reject(1);
      expect(jobRepository.save).toHaveBeenCalledWith({
        ...job,
        state: State.Rejected,
      });
    });

    it('throws an error if state is not pending', async () => {
      const job = await factory(Job)().make({ state: State.Cancelled });
      jobRepository.findOne.mockResolvedValue(job);

      await expect(jobsService.reject(1)).rejects.toThrow(BadRequestException);
      expect(jobRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    beforeEach(async () => {
      jobRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
      }));
    });

    it('calls jobRepository.createJob(createJobDto) and successfully retrieves and return job', async () => {
      const jwtPayload: JwtPayload = {
        userId: 1,
        username: 'foo.bar@gmail.com',
        firstName: 'foo',
        lastName: 'bar',
        cvIds: [1],
        roles: ['ADMIN'],
      };
      const createJobDto: CreateJobDto = {
        runner: 'SkillSubjectMerge',
        description: 'Vuejs -> Vue.js',

        data: {
          sourceId: 1,
          targetId: 2,
        },
      };
      const job = await factory(Job)().make({ ...createJobDto, id: 1 });
      jobRepository.createJob.mockResolvedValue(job);
      jobRepository.findOne.mockResolvedValue(job);

      expect(jobRepository.createJob).not.toHaveBeenCalled();
      const result = await jobsService.create(jwtPayload, createJobDto);
      expect(result).toEqual(job);
      expect(jobRepository.createJob).toHaveBeenCalledWith(
        jwtPayload.userId,
        createJobDto,
      );
      expect(jobRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['user'],
      });
    });
  });
});
