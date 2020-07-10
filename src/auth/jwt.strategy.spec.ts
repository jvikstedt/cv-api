import { useSeeding, factory } from 'typeorm-seeding';
import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';
import { JwtStrategy } from './jwt.strategy';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: any;

  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = await factory(User)().make();

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({
        userId: 1,
        username: 'john.doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        cvIds: [1],
        templateIds: [],
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'john.doe@gmail.com' });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(jwtStrategy.validate({
        userId: 1,
        username: 'john.doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        cvIds: [1],
        templateIds: [],
      })).rejects.toThrow(UnauthorizedException);
    });
  });
});
