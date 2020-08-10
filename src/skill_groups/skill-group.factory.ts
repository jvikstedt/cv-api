import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { SkillGroup } from './skill-group.entity';

define(SkillGroup, (faker: typeof Faker) => {
  const skillGroup = new SkillGroup();
  skillGroup.name = faker.random.word();
  return skillGroup;
});
