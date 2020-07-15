import { IsOptional, IsString } from 'class-validator';

export class PatchCVDto {
  @IsOptional()
  @IsString()
  description?: string;
}
