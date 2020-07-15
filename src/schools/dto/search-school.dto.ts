import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchSchoolDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
