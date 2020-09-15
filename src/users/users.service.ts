import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PatchUserDto } from './dto/patch-user.dto';
import { User } from './user.entity';
import { CVService } from '../cv/cv.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly cvService: CVService,
  ) {}

  async findOne(userId: number): Promise<User> {
    const entity = await this.userRepository.findOne(userId);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async patch(userId: number, patchUserDto: PatchUserDto): Promise<User> {
    const oldUser = await this.userRepository.findOne(userId, {
      relations: ['cv'],
    });
    if (!oldUser) {
      throw new NotFoundException();
    }

    const newUser = await this.userRepository.save(
      R.merge(oldUser, patchUserDto),
    );

    if (oldUser.cv) {
      await this.cvService.reload(oldUser.cv.id);
    }

    return newUser;
  }
}
