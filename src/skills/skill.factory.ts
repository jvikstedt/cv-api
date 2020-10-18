import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Skill } from './skill.entity';

define(Skill, (faker: typeof Faker) => {
  const skill = new Skill();

  skill.experienceInYears = faker.random.number({
    min: 1,
    max: 3,
  });

  skill.interestLevel = faker.random.number({
    min: 1,
    max: 3,
  });
  skill.highlight =
    faker.random.number({
      min: 1,
      max: 10,
    }) === 1;

  return skill;
});
