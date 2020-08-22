import { IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreateSkillDto {
  @IsNumber()
  skillSubjectId: number;

  @IsNumber()
  @Min(0)
  experienceInYears: number;

  @IsNumber()
  @Min(1)
  @Max(3)
  interestLevel: number;

  @IsBoolean()
  highlight: boolean;
}
