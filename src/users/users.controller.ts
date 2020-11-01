import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  HttpException,
  ValidationError,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { PatchUserDto } from './dto/patch-user.dto';
import { AllowAuthenticated, AllowUserOwner } from '../roles/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch('/:userId')
  @AllowUserOwner()
  patch(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() patchUserDto: PatchUserDto,
  ): Promise<User> {
    return this.usersService.patch(userId, patchUserDto);
  }

  @Post('/search')
  @AllowAuthenticated()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  search(
    @Body() searchUserDto: SearchUserDto,
  ): Promise<{ items: User[]; total: number }> {
    return this.usersService.search(searchUserDto);
  }
}
