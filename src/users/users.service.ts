import * as R from 'ramda';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PatchUserDto } from './dto/patch-user.dto';
import { User } from './user.entity';
import { CVService } from '../cv/cv.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { CVRepository } from '../cv/cv.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly cvService: CVService,
    private readonly cvRepository: CVRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const users = await this.userRepository
      .createQueryBuilder()
      .where(
        'LOWER(username) = LOWER(:username) OR LOWER(email) = LOWER(:email)',
        {
          username: createUserDto.email,
          email: createUserDto.email,
        },
      )
      .getMany();

    if (users.length > 0) {
      throw new UnprocessableEntityException(
        `User '${createUserDto.email}' already exists`,
      );
    }

    const user = await this.userRepository.createUser(createUserDto);

    await this.cvRepository.createCV({
      userId: user.id,
      description: '',
    });

    return this.findOne(user.id);
  }

  async findOne(userId: number): Promise<User> {
    const entity = await this.userRepository.findOne(userId, {
      relations: ['cv'],
    });

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

  async search(
    searchUserDto: SearchUserDto,
  ): Promise<{ items: User[]; total: number }> {
    const [items, total] = await this.userRepository
      .createQueryBuilder('users')
      .where('users.email ilike :email', {
        email: `%${searchUserDto.email}%`,
      })
      .orderBy(searchUserDto.orderColumnName, searchUserDto.orderSort)
      .skip(searchUserDto.skip)
      .take(searchUserDto.take)
      .getManyAndCount();

    return {
      items,
      total,
    };
  }
}
