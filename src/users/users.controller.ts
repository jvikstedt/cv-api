import { Controller, Param, ParseIntPipe, Get, UseGuards, Patch, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CV } from '../cv/cv.entity';
import { AuthGuard } from '@nestjs/passport';
import { PatchUserDto } from './dto/patch-user-dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  patchUser(@Param('id', ParseIntPipe) userId: number, @Body() patchUserDto: PatchUserDto): Promise<User> {
    return this.usersService.patchUser(userId, patchUserDto);
  }

  @Get('/:id/cv')
  getUserCV(@Param('id', ParseIntPipe) userId: number): Promise<CV> {
    return this.usersService.getUserCV(userId);
  }
}
