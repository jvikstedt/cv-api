import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchTemplateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  global?: boolean;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any = {};
}
