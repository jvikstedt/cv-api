import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchTemplateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  data?: any = {};
}
