import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { ProjectMembership } from './project-membership.entity';

define(ProjectMembership, (faker: typeof Faker) => {
  const projectMembership = new ProjectMembership();

  projectMembership.startYear = faker.random.number({
    min: 2000,
    max: 2015,
  });

  projectMembership.startMonth = faker.random.number({
    min: 1,
    max: 12,
  });
  projectMembership.endMonth = faker.random.number({
    min: 1,
    max: 12,
  });

  projectMembership.endYear = projectMembership.startYear + 4;

  projectMembership.description = faker.lorem.words(10);
  projectMembership.highlight = false;

  return projectMembership;
});
