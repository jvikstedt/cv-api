import * as R from 'ramda';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, State } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { JobRepository } from './job.repository';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ADMIN_ROLE, JobEventType, QUEUE_NAME_JOB } from '../constants';
import { SearchJobDto } from './dto/search-job.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobRepository)
    private readonly jobRepository: JobRepository,

    @InjectQueue(QUEUE_NAME_JOB)
    private jobQueue: Queue,
  ) {}

  async create(user: JwtPayload, createJobDto: CreateJobDto): Promise<Job> {
    const job = await this.jobRepository.createJob(user.userId, createJobDto);
    return this.findOne(job.id);
  }

  async findOne(id: number): Promise<Job> {
    const entity = await this.jobRepository.findOne(id, {
      relations: ['user'],
    });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async findAll(user: JwtPayload): Promise<Job[]> {
    let jobs: Job[] = [];

    if (R.includes(ADMIN_ROLE, user.roles)) {
      jobs = await this.jobRepository.find({
        relations: ['user'],
      });
    } else {
      jobs = await this.jobRepository.find({
        where: {
          userId: user.userId,
        },
        relations: ['user'],
      });
    }

    return jobs;
  }

  async search(
    user: JwtPayload,
    searchJobDto: SearchJobDto,
  ): Promise<{ items: Job[]; total: number }> {
    let query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.user', 'user');

    if (R.not(R.includes(ADMIN_ROLE, user.roles))) {
      query = query.where('job.userId = :userId', {
        userId: user.userId,
      });
    }

    const [items, total] = await query
      .orderBy(searchJobDto.orderColumnName, searchJobDto.orderSort)
      .skip(searchJobDto.skip)
      .take(searchJobDto.take)
      .getManyAndCount();

    return {
      items,
      total,
    };
  }

  async approve(jobId: number): Promise<Job> {
    const job = await this.findOne(jobId);

    if (!R.equals(job.state, State.Pending)) {
      throw new BadRequestException(
        `Can't approve job with state ${job.state}`,
      );
    }

    const newJob = R.merge(job, {
      state: State.Approved,
    });

    await this.jobRepository.save(newJob);

    await this.jobQueue.add(JobEventType.Run, {
      id: job.id,
    });

    return this.findOne(job.id);
  }

  async reject(jobId: number): Promise<Job> {
    const job = await this.findOne(jobId);

    if (!R.equals(job.state, State.Pending)) {
      throw new BadRequestException(`Can't reject job with state ${job.state}`);
    }

    const newJob = R.merge(job, {
      state: State.Rejected,
    });
    await this.jobRepository.save(newJob);

    return this.findOne(job.id);
  }

  async cancel(jobId: number): Promise<Job> {
    const job = await this.findOne(jobId);

    if (!R.equals(job.state, State.Pending)) {
      throw new BadRequestException(`Can't cancel job with state ${job.state}`);
    }

    const newJob = R.merge(job, {
      state: State.Cancelled,
    });
    await this.jobRepository.save(newJob);

    return this.findOne(job.id);
  }
}
