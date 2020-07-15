import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { Education } from "./education.entity"

define(Education, (faker: typeof Faker) => {
  const education = new Education();

  education.startYear = faker.random.number({
    'min': 2000,
    'max': 2015,
  });

  education.endYear = education.startYear + 4;

  education.degree = faker.lorem.words(2);
  education.fieldOfStudy = faker.lorem.words(2);
  education.description = faker.lorem.words(10);

  return education;
})
