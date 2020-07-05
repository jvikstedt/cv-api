import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';
import { UserSubscriber } from './user.subscriber';
import { UsersConsumer } from './users.consumer';
import { CVModule } from '../cv/cv.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CVModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserSubscriber,
    UsersConsumer,
  ],
})
export class UsersHttpModule {}
