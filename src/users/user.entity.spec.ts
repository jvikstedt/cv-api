/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as bcrypt from 'bcrypt';
import { factory, useSeeding } from 'typeorm-seeding'
import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;

  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    user = await factory(User)().make();
    // @ts-ignore
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      // @ts-ignore
      bcrypt.hash.mockReturnValue(user.password);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword(user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
      expect(result).toEqual(true);
    });
    it('returns false as password is invalid', async () => {
      // @ts-ignore
      bcrypt.hash.mockReturnValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
