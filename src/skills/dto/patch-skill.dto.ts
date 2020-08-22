import { IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class PatchSkillDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  experienceInYears?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  interestLevel?: number;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
}
