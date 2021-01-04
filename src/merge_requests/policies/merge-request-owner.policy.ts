import { InjectRepository } from '@nestjs/typeorm';
import * as R from 'ramda';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { MergeRequestRepository } from '../merge-request.repository';

export default class MergeRequestOwnerPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(MergeRequestRepository)
    private mergeRequestRepository: MergeRequestRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const mergeRequestId = Number(params.mergeRequestId);

    const mergeRequest = await this.mergeRequestRepository.findOne(
      mergeRequestId,
    );

    if (mergeRequest && R.equals(mergeRequest.userId, user.userId)) {
      return true;
    }

    return false;
  }
}
