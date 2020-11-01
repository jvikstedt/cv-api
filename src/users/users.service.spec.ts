import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { PatchUserDto } from './dto/patch-user.dto';
import { CVService } from '../cv/cv.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CVRepository } from '../cv/cv.repository';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  createUser: jest.fn(),
});

const mockCVService = () => ({
  reload: jest.fn(),
});

const mockCVRepository = () => ({
  createCV: jest.fn(),
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
        { provide: CVService, useFactory: mockCVService },
        { provide: CVRepository, useFactory: mockCVRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    const getMany = jest.fn();

    beforeEach(async () => {
      userRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getMany,
      }));
    });

    it('calls userRepository.createUser(createUserDto) and successfully retrieves and return user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Developer',
        phone: '0501234567',
        location: 'Helsinki',
        workExperienceInYears: 5,
        email: 'john.doe@test.test',
      };
      const user = await factory(User)().make({
        id: 1,
        ...createUserDto,
      });
      userRepository.createUser.mockResolvedValue(user);
      getMany.mockResolvedValue([]);
      userRepository.findOne.mockResolvedValue(user);

      expect(userRepository.createUser).not.toHaveBeenCalled();
      const result = await usersService.create(createUserDto);
      expect(result).toEqual(user);
      expect(userRepository.createUser).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['cv'],
      });
    });
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
      expect(userRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['cv'],
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        ...patchUserDto,
      });
    });
  });

  describe('findOne', () => {
    it('calls userRepository.findOne() and successfully retrieves and return user', async () => {
      const user = await factory(User)().make();
      userRepository.findOne.mockResolvedValue(user);

      const result = await usersService.findOne(1);
      expect(result).toEqual(user);

      expect(userRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['cv'],
      });
    });

    it('throws an error as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(usersService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
