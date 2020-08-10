import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Project } from './project.entity';

define(Project, (faker: typeof Faker) => {
  const project = new Project();
  project.name = faker.commerce.productName();
  return project;
});
