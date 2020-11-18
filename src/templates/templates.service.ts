import * as R from 'ramda';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { TemplateRepository } from './template.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { PatchTemplateDto } from './dto/patch-template.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ADMIN_ROLE } from '../constants';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateRepository)
    private readonly templateRepository: TemplateRepository,
  ) {}

  async create(
    user: JwtPayload,
    createTemplateDto: CreateTemplateDto,
  ): Promise<Template> {
    if (createTemplateDto.global && R.not(R.includes(ADMIN_ROLE, user.roles))) {
      throw new UnprocessableEntityException(
        "Can't set template as global without admin privileges",
      );
    }

    const template = await this.templateRepository.createTemplate(
      user.userId,
      createTemplateDto,
    );

    return template;
  }

  async patchTemplate(
    user: JwtPayload,
    id: number,
    patchTemplateDto: PatchTemplateDto,
  ): Promise<Template> {
    const oldTemplate = await this.findOne(id);

    if (patchTemplateDto.global && R.not(R.includes(ADMIN_ROLE, user.roles))) {
      throw new UnprocessableEntityException(
        "Can't set template as global without admin privileges",
      );
    }

    const newTemplate = R.merge(oldTemplate, patchTemplateDto);

    return this.templateRepository.save(newTemplate);
  }

  async findAll(userId: number): Promise<Template[]> {
    return this.templateRepository
      .createQueryBuilder('template')
      .where('template.userId = :userId OR global', {
        userId,
      })
      .getMany();
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
