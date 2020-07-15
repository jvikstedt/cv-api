import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class PatchSchoolDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}
