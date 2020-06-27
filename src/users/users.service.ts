import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PatchUserDto } from './dto/patch-user-dto';
import { User } from './user.entity';
import { CV } from '../cv/cv.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getUser(userId: number): Promise<User> {
    const entity = await this.userRepository.findOne(userId);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async patchUser(userId: number, patchUserDto: PatchUserDto): Promise<User> {
    await this.userRepository.createQueryBuilder()
      .update(patchUserDto)
      .where("id = :id", { id: userId })
      .execute();

    return this.getUser(userId);
  }

  async getUserCV(userId: number): Promise<CV> {
    const entity = await this.userRepository.findOne(userId, { relations: ['cv'] });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity.cv;
  }
}
