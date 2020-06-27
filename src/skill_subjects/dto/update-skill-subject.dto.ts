import { IsNotEmpty } from 'class-validator';

export class UpdateSkillSubjectDto {
  @IsNotEmpty()
  name: string;
}
