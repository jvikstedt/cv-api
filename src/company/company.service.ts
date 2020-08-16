import * as R from 'ramda';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PatchCompanyDto } from './dto/patch-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const companies = await this.companyRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: createCompanyDto.name,
      })
      .getMany();

    if (companies.length > 0) {
      throw new UnprocessableEntityException(
        `Company '${createCompanyDto.name}' already exists`,
      );
    }

    const company = await this.companyRepository.createCompany(
      createCompanyDto,
    );

    return company;
  }

  async patch(
    companyId: number,
    patchCompanyDto: PatchCompanyDto,
  ): Promise<Company> {
    const oldCompany = await this.findOne(companyId);

    const newCompany = R.merge(oldCompany, patchCompanyDto);

    return this.companyRepository.save(newCompany);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(companyId: number): Promise<Company> {
    const entity = await this.companyRepository.findOne(companyId);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(companyId: number): Promise<void> {
    const result = await this.companyRepository.delete(companyId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async search(searchCompanyDto: SearchCompanyDto): Promise<Company[]> {
    return this.companyRepository
      .createQueryBuilder('company')
      .where('company.name ilike :name', { name: `%${searchCompanyDto.name}%` })
      .limit(searchCompanyDto.limit)
      .getMany();
  }
}
