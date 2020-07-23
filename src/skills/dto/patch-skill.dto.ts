import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class PatchSkillDto {
  @IsOptional()
  @IsNumber()
  experienceInYears?: number;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
}
