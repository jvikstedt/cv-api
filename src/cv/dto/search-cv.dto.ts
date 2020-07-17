import { IsNumber, IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class SkillSearch {
  @IsBoolean()
  required? = false;

  @IsNumber()
  skillSubjectId: number;
}

export class Sort {
  @IsString()
  field: string;

  @IsString()
  order?: string = 'asc';
}

export class SearchCVDto {
  @IsString()
  fullName?: string = '';

  @IsNumber()
  limit?: number = 10;

  @IsArray()
  skills?: SkillSearch[] = [];

  @IsOptional()
  @IsArray()
  sorts?: Sort[];
}
