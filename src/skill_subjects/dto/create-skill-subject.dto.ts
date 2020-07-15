import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSkillSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  skillGroupId: number;
}
