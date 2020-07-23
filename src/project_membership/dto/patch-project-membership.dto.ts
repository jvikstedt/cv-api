import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class PatchProjectMembershipDto {
  @IsOptional()
  @IsString()
  description?: string;

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

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
}
