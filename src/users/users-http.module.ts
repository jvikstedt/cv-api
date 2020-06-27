import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
})
export class UsersHttpModule {}
