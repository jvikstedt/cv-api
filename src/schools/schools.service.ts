import * as R from 'ramda';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './school.entity';
import { SchoolRepository } from './school.repository';
import { CreateSchoolDto } from './dto/create-school.dto';
import { PatchSchoolDto } from './dto/patch-school.dto';
import { SearchSchoolDto } from './dto/search-school.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(SchoolRepository)
    private readonly schoolRepository: SchoolRepository,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const schools = await this.schoolRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: createSchoolDto.name,
      })
      .getMany();

    if (schools.length > 0) {
      throw new UnprocessableEntityException(
        `School '${createSchoolDto.name}' already exists`,
      );
    }

    const school = await this.schoolRepository.createSchool(createSchoolDto);

    return school;
  }

  async patch(
    schoolId: number,
    patchSchoolDto: PatchSchoolDto,
  ): Promise<School> {
    const oldSchool = await this.findOne(schoolId);

    const newSchool = R.merge(oldSchool, patchSchoolDto);

    return this.schoolRepository.save(newSchool);
  }

  async findAll(): Promise<School[]> {
    return this.schoolRepository.find();
  }

  async findOne(schoolId: number): Promise<School> {
    const entity = await this.schoolRepository.findOne(schoolId);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(schoolId: number): Promise<void> {
    const result = await this.schoolRepository.delete(schoolId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async search(searchSchoolDto: SearchSchoolDto): Promise<School[]> {
    return this.schoolRepository
      .createQueryBuilder('school')
      .where('school.name ilike :name', { name: `%${searchSchoolDto.name}%` })
      .limit(searchSchoolDto.limit)
      .getMany();
  }
}
