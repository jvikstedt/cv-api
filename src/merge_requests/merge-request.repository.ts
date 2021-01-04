import { EntityRepository, Repository } from 'typeorm';
import { CreateMergeRequestDto } from './dto/create-merge-request.dto';
import { MergeRequest, State } from './merge-request.entity';

@EntityRepository(MergeRequest)
export class MergeRequestRepository extends Repository<MergeRequest> {
  async createMergeRequest(
    userId: number,
    createMergeRequestDto: CreateMergeRequestDto,
  ): Promise<MergeRequest> {
    const { entity, description, sourceId, targetId } = createMergeRequestDto;

    const mergeRequest = this.create({
      state: State.Pending,
      userId,
      entity,
      description,
      sourceId,
      targetId,
    });
    return mergeRequest.save();
  }
}
