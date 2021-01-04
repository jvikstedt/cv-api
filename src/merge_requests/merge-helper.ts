import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateMergeRequestDto } from './dto/create-merge-request.dto';
import { MergeRequest } from './merge-request.entity';

export interface MergeHelper {
  buildMergeRequest(
    user: JwtPayload,
    createMergeRequestDto: CreateMergeRequestDto,
  ): Promise<MergeRequest>;

  merge(mergeRequest: MergeRequest): Promise<void>;
}
