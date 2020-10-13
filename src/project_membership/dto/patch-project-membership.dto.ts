import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
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

export class PatchProjectMembershipDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  startYear?: number;

  @IsOptional()
  @IsNumber()
  startMonth?: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsOptional()
  @IsNumber()
  endMonth?: number;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @IsOptional()
  @IsArray()
  skillSubjectIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipSkillDto)
  membershipSkills?: MembershipSkillDto[];
}
