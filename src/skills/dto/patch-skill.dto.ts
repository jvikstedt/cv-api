import { IsOptional, IsNumber } from 'class-validator';

export class PatchSkillDto {
  @IsOptional()
  @IsNumber()
  experienceInYears: number;
}
