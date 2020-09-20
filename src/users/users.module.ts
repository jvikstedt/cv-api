import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { CVModule } from '../cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CVModule],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
