import { Controller, Param, ParseIntPipe, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { PatchUserDto } from './dto/patch-user.dto';
import { AllowUserOwner } from '../roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/:userId')
  @AllowUserOwner()
  patch(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() patchUserDto: PatchUserDto,
  ): Promise<User> {
    return this.usersService.patch(userId, patchUserDto);
  }
}
