import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class PatchUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatarId?: string;
}
