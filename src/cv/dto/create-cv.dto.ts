import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCVDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  description?: string = "";
}
