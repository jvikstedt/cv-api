import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { Template } from "./template.entity"

define(Template, (faker: typeof Faker) => {
  const template = new Template()
  template.name = faker.random.word();
  return template;
})
