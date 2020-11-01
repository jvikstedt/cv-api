import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { UNIQUENESS_VIOLATION } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      firstName,
      lastName,
      jobTitle,
      phone,
      location,
      workExperienceInYears,
      email,
    } = createUserDto;

    const user = this.create({
      username: email,
      firstName,
      lastName,
      jobTitle,
      phone,
      location,
      workExperienceInYears,
      email,
    });

    return user.save();
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = this.create();
    user.username = username;
    user.firstName = '';
    user.lastName = '';
    user.jobTitle = '';
    user.phone = '';
    user.location = '';
    user.workExperienceInYears = 1;
    user.email = '';
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === UNIQUENESS_VIOLATION) {
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.createQueryBuilder('user')
      .where({ username })
      .addSelect('user.password')
      .addSelect('user.salt')
      .getOne();

    if (user && (await user.validatePassword(password))) {
      return user;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
