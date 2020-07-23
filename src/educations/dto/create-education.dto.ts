import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateEducationDto {
  @IsNumber()
  schoolId: number;

  @IsString()
  degree: string;

  @IsString()
  fieldOfStudy: string;

  @IsString()
  description: string;

  @IsNumber()
  startYear: number;

  @IsOptional()
  @IsNumber()
  endYear: number;

  @IsBoolean()
  highlight: boolean;
}
