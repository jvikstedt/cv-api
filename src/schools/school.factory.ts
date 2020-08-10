import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { School } from './school.entity';

define(School, (faker: typeof Faker) => {
  const school = new School();
  school.name = `${faker.name.lastName()}'s University`;
  return school;
});
