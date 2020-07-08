import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
