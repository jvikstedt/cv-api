import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  email?: string = '';

  @IsOptional()
  @IsNumber()
  take?: number = 10;

  @IsOptional()
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @IsString()
  orderColumnName?: string = 'users.email';

  @IsOptional()
  @IsString()
  orderSort?: 'ASC' | 'DESC' = 'ASC';
}
