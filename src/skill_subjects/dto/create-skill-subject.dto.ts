import { IsNotEmpty } from 'class-validator';

export class CreateSkillSubjectDto {
  @IsNotEmpty()
  name: string;
}
