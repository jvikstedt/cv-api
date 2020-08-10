import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { WorkExperience } from './work-experience.entity';

define(WorkExperience, (faker: typeof Faker) => {
  const workExperience = new WorkExperience();

  workExperience.startYear = faker.random.number({
    min: 2000,
    max: 2015,
  });

  workExperience.startMonth = faker.random.number({
    min: 1,
    max: 12,
  });
  workExperience.endMonth = faker.random.number({
    min: 1,
    max: 12,
  });

  workExperience.endYear = workExperience.startYear + 4;

  workExperience.description = faker.lorem.words(10);
  workExperience.jobTitle = faker.name.jobTitle();

  return workExperience;
});
