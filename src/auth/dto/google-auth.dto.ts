import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
