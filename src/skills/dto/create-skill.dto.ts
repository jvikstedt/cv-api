import { IsNotEmpty } from 'class-validator';

export class CreateSkillDto {
  @IsNotEmpty()
  cvId: number;

  @IsNotEmpty()
  skillSubjectId: number;

  @IsNotEmpty()
  experienceInYears: number;
}
