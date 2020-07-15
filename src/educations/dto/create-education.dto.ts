import { IsNumber, IsString, IsOptional } from 'class-validator';

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
}
