import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { TemplateRepository } from './template.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import {PatchTemplateDto} from './dto/patch-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateRepository)
    private readonly templateRepository: TemplateRepository,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const template = await this.templateRepository.createTemplate(createTemplateDto);

    return template;
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const template = await this.findOne(id);

    template.name = updateTemplateDto.name;
    template.data = updateTemplateDto.data;

    return await this.templateRepository.save(template);
  }

  async patchTemplate(id: number, patchTemplateDto: PatchTemplateDto): Promise<Template> {
    const oldTemplate = await this.findOne(id);

    const newTemplate = R.merge(oldTemplate, patchTemplateDto);

    return this.templateRepository.save(newTemplate);
  }

  async findAll(): Promise<Template[]> {
    return this.templateRepository.find();
  }

  async findOne(id: number): Promise<Template> {
    const entity = await this.templateRepository.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(id: number): Promise<void> {
    const result = await this.templateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
