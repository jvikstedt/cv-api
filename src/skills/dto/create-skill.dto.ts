import { IsNumber, IsBoolean } from 'class-validator';

export class CreateSkillDto {
  @IsNumber()
  skillSubjectId: number;

  @IsNumber()
  experienceInYears: number;

  @IsBoolean()
  highlight: boolean;
}
