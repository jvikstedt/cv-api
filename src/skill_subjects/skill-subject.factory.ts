import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { SkillSubject } from "./skill-subject.entity"

define(SkillSubject, (faker: typeof Faker) => {
  const skillSubject = new SkillSubject();
  skillSubject.name = faker.random.word();
  return skillSubject;
})
