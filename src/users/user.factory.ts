import * as bcrypt from 'bcrypt';
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from './user.entity';

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.username = faker.internet.email();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.jobTitle = faker.name.jobTitle();
  user.phone = faker.phone.phoneNumber();
  user.location = `${faker.address.county()}, ${faker.address.city()}`;
  user.email = user.username;
  user.password = faker.internet.password(10, false);
  user.salt = bcrypt.genSaltSync();

  user.workExperienceInYears = faker.random.number({
    min: 1,
    max: 20,
  });
  return user;
});
