import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';

import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { UNIQUENESS_VIOLATION } from '../constants';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.create();
    user.username = username;
    user.firstName = '';
    user.lastName = '';
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === UNIQUENESS_VIOLATION) {
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.createQueryBuilder('user')
      .where({ username })
      .addSelect('user.password')
      .addSelect('user.salt')
      .getOne();

    if (user && await user.validatePassword(password)) {
      return user.username;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
