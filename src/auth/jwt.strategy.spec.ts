import { useSeeding } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const jwtPayload = {
        userId: 1,
        username: 'john.doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        cvIds: [1],
        templateIds: [],
        roles: [],
      };

      const result = await jwtStrategy.validate(jwtPayload);
      expect(result).toEqual(jwtPayload);
    });
  });
});
