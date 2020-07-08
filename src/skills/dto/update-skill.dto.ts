import { IsNumber } from 'class-validator';

export class UpdateSkillDto {
  @IsNumber()
  experienceInYears: number;
}
