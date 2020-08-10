import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: true,
    }),
  )
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: true,
    }),
  )
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/google/signin')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: true,
    }),
  )
  async googleAuth(
    @Body() googleAuthDto: GoogleAuthDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.googleAuth(googleAuthDto);
  }
}
