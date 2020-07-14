import { IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsOptional()
  @IsString()
  firstName?: string = '';

  @IsOptional()
  @IsString()
  lastName?: string = '';

  @IsOptional()
  @IsString()
  avatarId?: string;
}
