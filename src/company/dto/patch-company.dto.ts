import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class PatchCompanyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}
