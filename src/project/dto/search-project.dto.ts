import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
