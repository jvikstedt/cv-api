import { IsNumber, IsString } from 'class-validator';

export class SearchCVDto {
  @IsString()
  name: string;

  @IsNumber()
  limit?: number = 10;
}
