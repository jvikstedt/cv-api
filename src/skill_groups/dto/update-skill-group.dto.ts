import { IsNotEmpty } from 'class-validator';

export class UpdateSkillGroupDto {
  @IsNotEmpty()
  name: string;
}
