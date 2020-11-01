import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNumber()
  @IsPositive()
  workExperienceInYears: number;

  @IsNotEmpty()
  @IsString()
  email: string;
}
