import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Role } from './role.entity';

define(Role, (faker: typeof Faker) => {
  const role = new Role();
  role.name = faker.lorem.word().toUpperCase();
  return role;
});
