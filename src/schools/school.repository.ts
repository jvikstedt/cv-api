import { School } from './school.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
  async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const { name } = createSchoolDto;

    const school = this.create({ name });
    return school.save();
  }
}
