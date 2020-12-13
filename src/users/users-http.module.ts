import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';
import { UserOwnerPolicy } from './policies';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [UsersController],
  providers: [UserOwnerPolicy],
})
export class UsersHttpModule {}
