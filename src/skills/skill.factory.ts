import { define } from 'typeorm-seeding';
import { Skill } from './skill.entity';

define(Skill, () => {
  const skill = new Skill();

  skill.experienceInYears = 1;
  skill.highlight = false;

  return skill;
});
