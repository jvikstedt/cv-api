import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { CV } from './cv.entity';

define(CV, (faker: typeof Faker) => {
  const cv = new CV();

  cv.description = faker.lorem.text();

  return cv;
});
