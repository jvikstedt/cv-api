import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchSkillSubjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
