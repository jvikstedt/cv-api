import { Controller, Param, ParseIntPipe, UseGuards, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { PatchUserDto } from './dto/patch-user.dto';
import { UserGuard } from './user.guard';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Patch('/:userId')
  @UseGuards(UserGuard)
  patch(@Param('userId', ParseIntPipe) userId: number, @Body() patchUserDto: PatchUserDto): Promise<User> {
    return this.usersService.patch(userId, patchUserDto);
  }
}
