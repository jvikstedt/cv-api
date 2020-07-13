import { IsNumber } from 'class-validator';

export class CreateSkillDto {
  @IsNumber()
  skillSubjectId: number;

  @IsNumber()
  experienceInYears: number;
}
