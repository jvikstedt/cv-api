import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
