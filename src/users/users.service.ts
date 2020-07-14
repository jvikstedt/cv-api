import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PatchUserDto } from './dto/patch-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findOne(userId: number): Promise<User> {
    const entity = await this.userRepository.findOne(userId);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async patch(userId: number, patchUserDto: PatchUserDto): Promise<User> {
    const oldUser = await this.findOne(userId)

    const newUser = R.merge(oldUser, patchUserDto);

    return this.userRepository.save(newUser);
  }
}
