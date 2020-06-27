import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { User } from './user.entity'

define(User, (faker: typeof Faker) => {
  const user = new User()
  user.username = faker.internet.email();
  user.firstName = '';
  user.lastName = '';
  user.password = faker.internet.password(10, false);
  user.salt = 'testSalt';
  return user
})
