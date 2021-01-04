import * as R from 'ramda';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MergeRequest, State } from './merge-request.entity';
import { CreateMergeRequestDto } from './dto/create-merge-request.dto';
import { MergeRequestRepository } from './merge-request.repository';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ADMIN_ROLE } from '../constants';
import { SearchMergeRequestDto } from './dto/search-merge-request.dto';
import { SkillSubjectsMergeHelper } from './helpers/skill-subjects-merge.helper';
import { MergeHelper } from './merge-helper';

@Injectable()
export class MergeRequestsService {
  helpers: { [key: string]: MergeHelper } = {};

  constructor(
    @InjectRepository(MergeRequestRepository)
    private readonly mergeRequestRepository: MergeRequestRepository,

    private readonly skillSubjectsMergeHelper: SkillSubjectsMergeHelper,
  ) {
    this.helpers[
      SkillSubjectsMergeHelper.EntityName
    ] = this.skillSubjectsMergeHelper;
  }

  async create(
    user: JwtPayload,
    createMergeRequestDto: CreateMergeRequestDto,
  ): Promise<MergeRequest> {
    if (
      R.equals(createMergeRequestDto.sourceId, createMergeRequestDto.targetId)
    ) {
      throw new UnprocessableEntityException(
        `Source and target entity can't be same`,
      );
    }

    const helper = this.helpers[createMergeRequestDto.entity];
    if (!helper) {
      throw new Error(
        `Could not find merge request helper for ${createMergeRequestDto.entity}`,
      );
    }

    const mergeRequest = await helper.buildMergeRequest(
      user,
      createMergeRequestDto,
    );

    await mergeRequest.save();

    return this.findOne(mergeRequest.id);
  }

  async findOne(id: number): Promise<MergeRequest> {
    const entity = await this.mergeRequestRepository.findOne(id, {
      relations: ['user'],
    });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async findAll(user: JwtPayload): Promise<MergeRequest[]> {
    let requests: MergeRequest[] = [];

    if (R.includes(ADMIN_ROLE, user.roles)) {
      requests = await this.mergeRequestRepository.find({
        relations: ['user'],
      });
    } else {
      requests = await this.mergeRequestRepository.find({
        where: {
          userId: user.userId,
        },
        relations: ['user'],
      });
    }

    return requests;
  }

  async search(
    user: JwtPayload,
    searchMergeRequestDto: SearchMergeRequestDto,
  ): Promise<{ items: MergeRequest[]; total: number }> {
    let query = this.mergeRequestRepository
      .createQueryBuilder('mergeRequest')
      .leftJoinAndSelect('mergeRequest.user', 'user');

    if (R.not(R.includes(ADMIN_ROLE, user.roles))) {
      query = query.where('mergeRequest.userId = :userId', {
        userId: user.userId,
      });
    }

    const [items, total] = await query
      .orderBy(
        searchMergeRequestDto.orderColumnName,
        searchMergeRequestDto.orderSort,
      )
      .skip(searchMergeRequestDto.skip)
      .take(searchMergeRequestDto.take)
      .getManyAndCount();

    return {
      items,
      total,
    };
  }

  async execute(mergeRequestId: number): Promise<MergeRequest> {
    const mergeRequest = await this.findOne(mergeRequestId);

    try {
      const helper = this.helpers[mergeRequest.entity];
      if (!helper) {
        throw new Error(
          `Could not find merge request helper for ${mergeRequest.entity}`,
        );
      }

      await helper.merge(mergeRequest);

      const newMergeRequest = R.merge(mergeRequest, {
        state: State.Completed,
      });
      await this.mergeRequestRepository.save(newMergeRequest);
    } catch (err) {
      const newMergeRequest = R.merge(mergeRequest, {
        state: State.Failed,
        msg: err,
      });
      await this.mergeRequestRepository.save(newMergeRequest);
    }

    return this.findOne(mergeRequest.id);
  }

  async reject(mergeRequestId: number): Promise<MergeRequest> {
    const mergeRequest = await this.findOne(mergeRequestId);

    const newMergeRequest = R.merge(mergeRequest, {
      state: State.Rejected,
    });
    await this.mergeRequestRepository.save(newMergeRequest);

    return this.findOne(mergeRequest.id);
  }

  async delete(mergeRequestId: number): Promise<MergeRequest> {
    const mergeRequest = await this.findOne(mergeRequestId);

    const newMergeRequest = R.merge(mergeRequest, {
      state: State.Cancelled,
    });
    await this.mergeRequestRepository.save(newMergeRequest);

    return this.findOne(mergeRequest.id);
  }
}
