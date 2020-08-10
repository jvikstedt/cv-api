import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { PatchUserDto } from './dto/patch-user.dto';

const mockUsersService = () => ({
  findOne: jest.fn(),
  patch: jest.fn(),
});

describe('UsersController', () => {
  let usersController: any;
  let usersService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [{ provide: UsersService, useFactory: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('patch', () => {
    it('calls service patch with passed data', async () => {
      const patchUserDto: PatchUserDto = { firstName: 'Bob' };
      const oldUser = await factory(User)().make({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      });
      usersService.patch.mockResolvedValue({ ...oldUser, ...patchUserDto });

      expect(usersService.patch).not.toHaveBeenCalled();
      const result = await usersController.patch(1, patchUserDto);
      expect(usersService.patch).toHaveBeenCalledWith(1, patchUserDto);
      expect(result).toEqual({ ...oldUser, ...patchUserDto });
    });
  });
});
