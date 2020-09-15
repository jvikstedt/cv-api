import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkExperience } from './work-experience.entity';
import { WorkExperienceRepository } from './work-experience.repository';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { PatchWorkExperienceDto } from './dto/patch-work-experience.dto';
import { CVService } from '../cv/cv.service';

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperienceRepository)
    private readonly workExperienceRepository: WorkExperienceRepository,

    private readonly cvService: CVService,
  ) {}

  async create(
    cvId: number,
    createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    const workExperience = await this.workExperienceRepository.createWorkExperience(
      cvId,
      createWorkExperienceDto,
    );

    await this.cvService.reload(cvId);

    return this.findOne(cvId, workExperience.id);
  }

  async patch(
    cvId: number,
    workExperienceId: number,
    patchWorkExperienceDto: PatchWorkExperienceDto,
  ): Promise<WorkExperience> {
    const oldWorkExperience = await this.findOne(cvId, workExperienceId);

    const newWorkExperience = await this.workExperienceRepository.save(
      R.merge(oldWorkExperience, patchWorkExperienceDto),
    );

    await this.cvService.reload(cvId);

    return newWorkExperience;
  }

  async findAll(cvId: number): Promise<WorkExperience[]> {
    return this.workExperienceRepository.find({
      where: { cvId },
      relations: ['company'],
    });
  }

  async findOne(
    cvId: number,
    workExperienceId: number,
  ): Promise<WorkExperience> {
    const entity = await this.workExperienceRepository.findOne(
      { cvId, id: workExperienceId },
      { relations: ['company'] },
    );

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(
    cvId: number,
    workExperienceId: number,
  ): Promise<WorkExperience> {
    const workExperience = await this.findOne(cvId, workExperienceId);

    await this.workExperienceRepository.delete({ cvId, id: workExperienceId });

    await this.cvService.reload(cvId);

    return workExperience;
  }
}
