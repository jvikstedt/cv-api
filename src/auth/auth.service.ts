import * as R from 'ramda';
import * as config from 'config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { CVRepository } from '../cv/cv.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { OAuth2Client } from 'google-auth-library';

import { CONFIG_GOOGLE, CONFIG_GOOGLE_CLIENT_ID } from '../constants';
import { CVService } from '../cv/cv.service';

const googleConfig = config.get(CONFIG_GOOGLE);

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || googleConfig[CONFIG_GOOGLE_CLIENT_ID];

const client = new OAuth2Client(CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly cvRepository: CVRepository,
    private readonly jwtService: JwtService,
    private readonly cvService: CVService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.userRepository.signUp(authCredentialsDto);

    const cv = this.cvRepository.create();
    cv.userId = user.id;
    cv.description = '';

    await this.cvService.reload(cv.id);

    await cv.save();
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    let user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user = await this.userRepository.findOne(user.id, {
      relations: ['cv', 'templates', 'roles'],
    });

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      cvIds: [user.cv.id],
      templateIds: R.map((t) => t.id, user.templates),
      roles: R.map((role) => role.name, user.roles),
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async googleAuth(
    googleAuthDto: GoogleAuthDto,
  ): Promise<{ accessToken: string }> {
    const ticket = await client.verifyIdToken({
      idToken: googleAuthDto.idToken,
      audience: CLIENT_ID,
    });
    const {
      email,
      given_name: firstName,
      family_name: lastName,
    } = ticket.getPayload();

    let user = await this.userRepository.findOne(
      { username: email },
      { relations: ['cv', 'templates', 'roles'] },
    );
    if (!user) {
      user = this.userRepository.create({
        username: email,
        firstName,
        lastName,
        jobTitle: '',
        phone: '',
        location: '',
        workExperienceInYears: 1,
        email,
      });
      await user.save();

      const cv = await this.cvRepository
        .create({
          userId: user.id,
          description: '',
        })
        .save();
      user.cv = cv;
      user.templates = [];
      user.roles = [];

      await this.cvService.reload(cv.id);
    }

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      cvIds: [user.cv.id],
      templateIds: R.map((t) => t.id, user.templates),
      roles: R.map((role) => role.name, user.roles),
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
