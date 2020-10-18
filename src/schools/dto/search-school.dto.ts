import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchSchoolDto {
  @IsOptional()
  @IsString()
  name?: string = '';

  @IsOptional()
  @IsNumber()
  take?: number = 10;

  @IsOptional()
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @IsString()
  orderColumnName?: string = 'school.name';

  @IsOptional()
  @IsString()
  orderSort?: 'ASC' | 'DESC' = 'ASC';
}
