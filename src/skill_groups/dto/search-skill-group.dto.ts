import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchSkillGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
