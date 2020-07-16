import * as R from 'ramda';
import * as config from 'config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { UserRepository } from '../users/user.repository';
import { CVRepository } from '../cv/cv.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { OAuth2Client } from 'google-auth-library';

import {
  CONFIG_GOOGLE,
  CONFIG_GOOGLE_CLIENT_ID,
  QUEUE_NAME_CV,
  CONFIG_QUEUE,
  CONFIG_QUEUE_CV_RELOAD,
  EventType,
} from '../constants';

const googleConfig = config.get(CONFIG_GOOGLE);

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || googleConfig[CONFIG_GOOGLE_CLIENT_ID];

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

const client = new OAuth2Client(CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly cvRepository: CVRepository,
    private readonly jwtService: JwtService,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.userRepository.signUp(authCredentialsDto);

    const cv = this.cvRepository.create();
    cv.userId = user.id;
    cv.description = '';

    await this.cvQueue.add(EventType.Reload, {
      id: cv.id,
      updateTimestamp: true,
    }, {
      delay: cvReloadDelay,
    });

    await cv.save();
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    let user = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user = await this.userRepository.findOne(user.id, { relations: ['cv', 'templates'] })

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      cvIds: [user.cv.id],
      templateIds: R.map(t => t.id, user.templates),
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async googleAuth(googleAuthDto: GoogleAuthDto): Promise<{ accessToken: string }> {
    const ticket = await client.verifyIdToken({
        idToken: googleAuthDto.idToken,
        audience: CLIENT_ID,
    });
    const { email, given_name: firstName, family_name: lastName } = ticket.getPayload();

    let user = await this.userRepository.findOne({ username: email }, { relations: ['cv', 'templates'] });
    if (!user) {
      user = this.userRepository.create({
        username: email,
        firstName,
        lastName,
      });
      await user.save();

      const cv = await this.cvRepository.create({
        userId: user.id,
        description: '',
      }).save();
      user.cv = cv;
      user.templates = [];

      await this.cvQueue.add(EventType.Reload, {
        id: cv.id,
        updateTimestamp: true,
      }, {
        delay: cvReloadDelay,
      });
    }

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      cvIds: [user.cv.id],
      templateIds: R.map(t => t.id, user.templates),
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
