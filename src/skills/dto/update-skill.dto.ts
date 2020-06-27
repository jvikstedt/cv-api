import { IsNotEmpty } from 'class-validator';

export class UpdateSkillDto {
  @IsNotEmpty()
  experienceInYears: number;
}
