import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './education.entity';
import { EducationRepository } from './education.repository';
import { CreateEducationDto } from './dto/create-education.dto';
import { PatchEducationDto } from './dto/patch-education.dto';
import { CVService } from '../cv/cv.service';

@Injectable()
export class EducationsService {
  constructor(
    @InjectRepository(EducationRepository)
    private readonly educationRepository: EducationRepository,

    private readonly cvService: CVService,
  ) {}

  async create(
    cvId: number,
    createEducationDto: CreateEducationDto,
  ): Promise<Education> {
    const education = await this.educationRepository.createEducation(
      cvId,
      createEducationDto,
    );

    await this.cvService.reload(cvId);

    return this.findOne(cvId, education.id);
  }

  async patch(
    cvId: number,
    educationId: number,
    patchEducationDto: PatchEducationDto,
  ): Promise<Education> {
    const oldEducation = await this.findOne(cvId, educationId);

    const newEducation = await this.educationRepository.save(
      R.merge(oldEducation, patchEducationDto),
    );

    await this.cvService.reload(cvId);

    return newEducation;
  }

  async findAll(cvId: number): Promise<Education[]> {
    return this.educationRepository.find({
      where: { cvId },
      relations: ['school'],
    });
  }

  async findOne(cvId: number, educationId: number): Promise<Education> {
    const entity = await this.educationRepository.findOne(
      { cvId, id: educationId },
      { relations: ['school'] },
    );

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(cvId: number, educationId: number): Promise<Education> {
    const education = await this.findOne(cvId, educationId);

    await this.educationRepository.delete({ cvId, id: educationId });

    await this.cvService.reload(cvId);

    return education;
  }
}
