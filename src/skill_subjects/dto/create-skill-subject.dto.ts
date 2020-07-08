import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSkillSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  skillGroupId: number;
}
