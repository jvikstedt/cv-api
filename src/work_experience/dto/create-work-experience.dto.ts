import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateWorkExperienceDto {
  @IsNumber()
  companyId: number;

  @IsString()
  description: string;

  @IsString()
  jobTitle: string;

  @IsNumber()
  startYear: number;

  @IsNumber()
  startMonth: number;

  @IsOptional()
  @IsNumber()
  endYear: number;

  @IsOptional()
  @IsNumber()
  endMonth: number;

  @IsBoolean()
  highlight: boolean;
}
