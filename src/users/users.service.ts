import * as R from 'ramda';
import * as config from 'config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PatchUserDto } from './dto/patch-user.dto';
import { User } from './user.entity';
import { QUEUE_NAME_CV, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD, EventType } from '../constants';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  async findOne(userId: number): Promise<User> {
    const entity = await this.userRepository.findOne(userId);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async patch(userId: number, patchUserDto: PatchUserDto): Promise<User> {
    const oldUser = await this.userRepository.findOne(userId, { relations: ['cv'] });
    if (!oldUser) {
      throw new NotFoundException();
    }

    const newUser = await this.userRepository.save(
      R.merge(oldUser, patchUserDto),
    );

    if (oldUser.cv) {
      await this.cvQueue.add(EventType.Reload, {
        id: oldUser.cv.id,
        updateTimestamp: true,
      }, {
        delay: cvReloadDelay,
      });
    }

    return newUser;
  }
}
