import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateProjectMembershipDto {
  @IsNumber()
  projectId: number;

  @IsString()
  description: string;

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
