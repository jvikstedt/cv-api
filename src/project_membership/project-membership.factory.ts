import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { ProjectMembership } from './project-membership.entity';

define(ProjectMembership, (faker: typeof Faker) => {
  const projectMembership = new ProjectMembership();

  projectMembership.startYear = faker.random.number({
    min: 2015,
    max: 2018,
  });

  projectMembership.startMonth = faker.random.number({
    min: 1,
    max: 6,
  });

  const isOngoing = faker.random.boolean();

  if (!isOngoing) {
    projectMembership.endYear = faker.random.number({
      min: projectMembership.startYear,
      max: 2019,
    });

    projectMembership.endMonth = faker.random.number({
      min: 6,
      max: 12,
    });
  }

  projectMembership.description = faker.lorem.words(10);
  projectMembership.highlight =
    faker.random.number({
      min: 1,
      max: 10,
    }) === 1;

  return projectMembership;
});
