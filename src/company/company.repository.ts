import { Company } from './company.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';

@EntityRepository(Company)
export class CompanyRepository extends Repository<Company> {
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { name } = createCompanyDto;

    const company = this.create({ name });
    return company.save();
  }
}
