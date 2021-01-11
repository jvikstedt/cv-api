import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Job, State } from './job.entity';

define(Job, (faker: typeof Faker) => {
  const job = new Job();
  job.runner = faker.random.word();
  job.data = { [faker.random.word()]: faker.random.word() };
  job.description = faker.lorem.text();
  job.state = State.Pending;
  job.skipApproval = false;
  return job;
});
