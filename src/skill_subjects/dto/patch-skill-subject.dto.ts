import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class PatchSkillSubjectDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}
