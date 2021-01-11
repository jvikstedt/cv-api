import { EntityRepository, Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, State } from './job.entity';

@EntityRepository(Job)
export class JobRepository extends Repository<Job> {
  async createJob(userId: number, createJobDto: CreateJobDto): Promise<Job> {
    const { runner, description, data } = createJobDto;

    const job = this.create({
      state: State.Pending,
      userId,
      runner,
      description,
      data,
    });
    return job.save();
  }
}
