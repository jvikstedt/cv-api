import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Company } from './company.entity';

define(Company, (faker: typeof Faker) => {
  const company = new Company();
  company.name = faker.company.companyName(0);
  return company;
});
