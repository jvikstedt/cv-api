import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CV } from './cv.entity';
import { CVRepository } from './cv.repository';
import { CreateCVDto } from './dto/create-cv.dto';
import { UpdateCVDto } from './dto/update-cv.dto';
import { Skill } from '../skills/skill.entity';
import { PatchCVDto } from './dto/patch-cv.dto';

@Injectable()
export class CVService {
  constructor(
    @InjectRepository(CVRepository)
    private readonly cvRepository: CVRepository,
  ) {}

  async create(createCVDto: CreateCVDto): Promise<CV> {
    return this.cvRepository.createCV(createCVDto);
  }

  async update(id: number, updateCVDto: UpdateCVDto): Promise<CV> {
    const cv = await this.findOne(id);

    cv.description = updateCVDto.description;

    return this.cvRepository.save(cv);
  }

  async patchCV(cvId: number, patchCVDto: PatchCVDto): Promise<CV> {
    await this.cvRepository.createQueryBuilder()
      .update(patchCVDto)
      .where("id = :id", { id: cvId })
      .execute();

    return this.findOne(cvId);
  }

  async findAll(): Promise<CV[]> {
    return this.cvRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<CV> {
    const entity = await this.cvRepository.findOne(id, {
      relations: ['user'],
    });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(id: number): Promise<void> {
    const result = await this.cvRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async getCVSkills(cvId: number): Promise<Skill[]> {
    const entity = await this.cvRepository.findOne(cvId, { relations: ['skills', 'skills.skillSubject'] });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity.skills;
  }
}
