import * as R from 'ramda';
import * as config from 'config';
import { Queue } from 'bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMembership } from './project-membership.entity';
import { ProjectMembershipRepository } from './project-membership.repository';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';
import { QUEUE_NAME_CV, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD, EventType } from '../constants';
import { InjectQueue } from '@nestjs/bull';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Injectable()
export class ProjectMembershipService {
  constructor(
    @InjectRepository(ProjectMembershipRepository)
    private readonly projectMembershipRepository: ProjectMembershipRepository,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  async create(cvId: number, createProjectMembershipDto: CreateProjectMembershipDto): Promise<ProjectMembership> {
    const projectMembership = await this.projectMembershipRepository.createProjectMembership(cvId, createProjectMembershipDto);

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return this.findOne(cvId, projectMembership.id);
  }

  async patch(cvId: number, projectMembershipId: number, patchProjectMembershipDto: PatchProjectMembershipDto): Promise<ProjectMembership> {
    const oldProjectMembership = await this.findOne(cvId, projectMembershipId);

    const newProjectMembership = await this.projectMembershipRepository.save(
      R.merge(oldProjectMembership, patchProjectMembershipDto),
    );

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return newProjectMembership;
  }

  async findAll(cvId: number): Promise<ProjectMembership[]> {
    return this.projectMembershipRepository.find({
      where: { cvId },
      relations: ['project'],
    });
  }

  async findOne(cvId: number, projectMembershipId: number): Promise<ProjectMembership> {
    const entity = await this.projectMembershipRepository.findOne(
      { cvId, id: projectMembershipId },
      { relations: ['project'] },
    );

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(cvId: number, projectMembershipId: number): Promise<ProjectMembership> {
    const projectMembership = await this.findOne(cvId, projectMembershipId);

    await this.projectMembershipRepository.delete({ cvId, id: projectMembershipId });

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    return projectMembership;
  }
}
