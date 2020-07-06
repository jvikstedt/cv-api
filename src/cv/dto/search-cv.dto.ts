import { IsNumber, IsString, IsArray, IsBoolean } from 'class-validator';

export class SkillSearch {
  @IsBoolean()
  required? = false;

  @IsNumber()
  skillSubjectId: number;
}

export class SearchCVDto {
  @IsString()
  fullName?: string = '';

  @IsNumber()
  limit?: number = 10;

  @IsArray()
  skills?: SkillSearch[] = [];
}
