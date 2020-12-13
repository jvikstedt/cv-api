import {
  IsNumber,
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class SkillSearch {
  @IsBoolean()
  required? = false;

  @IsNumber()
  skillSubjectId: number;
}

export class WorkExperienceSearch {
  @IsBoolean()
  required? = false;

  @IsNumber()
  companyId: number;
}

export class EducationSearch {
  @IsBoolean()
  required? = false;

  @IsNumber()
  schoolId: number;
}

export class ProjectMembershipSearch {
  @IsBoolean()
  required? = false;

  @IsNumber()
  projectId: number;
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

  @IsString()
  text?: string = '';

  @IsNumber()
  limit?: number = 10;

  @IsArray()
  skills?: SkillSearch[] = [];

  @IsArray()
  workExperiences?: WorkExperienceSearch[] = [];

  @IsArray()
  educations?: EducationSearch[] = [];

  @IsArray()
  projectMemberships?: ProjectMembershipSearch[] = [];

  @IsOptional()
  @IsArray()
  sorts?: Sort[];
}
