import * as config from 'config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { CVModule } from '../cv/cv.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  CONFIG_JWT,
  CONFIG_JWT_SECRET,
  CONFIG_JWT_EXPIRES_IN,
} from '../constants';

const jwtConfig = config.get(CONFIG_JWT);

@Module({
  imports: [
    UsersModule,
    CVModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig[CONFIG_JWT_SECRET],
      signOptions: {
        expiresIn: jwtConfig[CONFIG_JWT_EXPIRES_IN],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
