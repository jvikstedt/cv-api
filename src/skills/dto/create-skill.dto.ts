import { IsNumber } from 'class-validator';

export class CreateSkillDto {
  @IsNumber()
  cvId: number;

  @IsNumber()
  skillSubjectId: number;

  @IsNumber()
  experienceInYears: number;
}
