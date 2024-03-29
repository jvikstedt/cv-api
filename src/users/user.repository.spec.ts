/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { UserRepository } from './user.repository';
import { UNIQUENESS_VIOLATION } from '../constants';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

const mockCredentialsDto = {
  username: 'john.doe@gmail.com',
  password: 'TestPassword123',
};

describe('UserRepository', () => {
  let userRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created user', async () => {
      const mockCreateUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Developer',
        phone: '0501234567',
        location: 'Helsinki',
        workExperienceInYears: 5,
        email: 'john.doe@test.test',
      };
      const user = await factory(User)().make();
      save.mockResolvedValue(user);

      expect(save).not.toHaveBeenCalled();
      const result = await userRepository.createUser(mockCreateUserDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('signUp', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the users', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        userRepository.signUp(mockCredentialsDto),
      ).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', async () => {
      save.mockRejectedValue({ code: UNIQUENESS_VIOLATION });
      await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a internal server error unknown error', async () => {
      save.mockRejectedValue({ code: '123123123' });
      await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user: any;
    const getOne = jest.fn();

    beforeEach(async () => {
      user = new User({
        username: 'john.doe@google.com',
        validatePassword: jest.fn(),
      });

      userRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne,
      }));
    });

    it('returns the username as validation is successful', async () => {
      getOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );
      expect(result.username).toEqual(user.username);
    });

    it('returns null as user cannot be found', async () => {
      getOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      getOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      // @ts-ignore
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
