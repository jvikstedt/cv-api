import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  ValidateNested,
} from 'class-validator';

export class MembershipSkillDto {
  @IsNumber()
  skillSubjectId: number;

  @IsBoolean()
  automaticCalculation = true;

  @IsNumber()
  @Min(0)
  experienceInYears = 0;
}

export class CreateProjectMembershipDto {
  @IsNumber()
  projectId: number;

  @IsString()
  description: string;

  @IsNumber()
  startYear: number;

  @IsNumber()
  startMonth: number;

  @IsOptional()
  @IsNumber()
  endYear: number;

  @IsOptional()
  @IsNumber()
  endMonth: number;

  @IsBoolean()
  highlight: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipSkillDto)
  membershipSkills: MembershipSkillDto[];
}
