import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
