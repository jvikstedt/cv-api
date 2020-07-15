import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { useSeeding, factory } from 'typeorm-seeding';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { PatchUserDto } from './dto/patch-user.dto';
import { QUEUE_NAME_CV } from '../constants';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockQueue = () => ({
  add: jest.fn(),
});

describe('UsersService', () => {
  let usersService: any;
  let userRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: getQueueToken(QUEUE_NAME_CV), useFactory: mockQueue },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('patch', () => {
    it('finds user by id and updates it', async () => {
      const user = await factory(User)().make({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      });
      const patchUserDto: PatchUserDto = { firstName: 'Bob' };

      userRepository.findOne.mockResolvedValue(user);
      userRepository.save.mockResolvedValue({ ...user, ...patchUserDto });

      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
      const result = await usersService.patch(1, patchUserDto);
      expect(result).toEqual({ ...user, ...patchUserDto });
      expect(userRepository.findOne).toHaveBeenCalledWith(1, { relations: ['cv'] });
      expect(userRepository.save).toHaveBeenCalledWith({ ...user, ...patchUserDto });
    });
  });

  describe('findOne', () => {
    it('calls userRepository.findOne() and successfully retrieves and return user', async () => {
      const user = await factory(User)().make();
      userRepository.findOne.mockResolvedValue(user);

      const result = await usersService.findOne(1);
      expect(result).toEqual(user);

      expect(userRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('throws an error as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(usersService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
