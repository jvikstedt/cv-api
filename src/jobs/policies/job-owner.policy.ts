import { InjectRepository } from '@nestjs/typeorm';
import * as R from 'ramda';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { JobRepository } from '../job.repository';

export default class JobOwnerPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(JobRepository)
    private jobRepository: JobRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const jobId = Number(params.jobId);

    const job = await this.jobRepository.findOne(jobId);

    if (job && R.equals(job.userId, user.userId)) {
      return true;
    }

    return false;
  }
}
