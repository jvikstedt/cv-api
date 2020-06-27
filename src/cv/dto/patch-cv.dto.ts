import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class PatchCVDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
}
