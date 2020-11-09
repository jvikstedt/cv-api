import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class PatchSkillGroupDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}
