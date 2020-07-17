import { IsOptional, IsNumber, IsString } from 'class-validator';

export class PatchWorkExperienceDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsNumber()
  startYear?: number;

  @IsOptional()
  @IsNumber()
  startMonth?: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsOptional()
  @IsNumber()
  endMonth?: number;
}