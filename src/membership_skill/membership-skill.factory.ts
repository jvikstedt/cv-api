import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { MembershipSkill } from './membership-skill.entity';

define(MembershipSkill, (faker: typeof Faker) => {
  const membershipSkill = new MembershipSkill();

  membershipSkill.automaticCalculation =
    faker.random.number({
      min: 1,
      max: 6,
    }) !== 1;
  if (!membershipSkill.automaticCalculation) {
    membershipSkill.experienceInYears = faker.random.number({
      min: 0.1,
      max: 2,
    });
  }

  return membershipSkill;
});
