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

// export enum Operation {
//   Add = 'ADD',
//   Remove = 'REMOVE',
//   Update = 'UPDATE',
// }

export class MembershipSkillDto {
  @IsNumber()
  skillSubjectId: number;

  @IsBoolean()
  automaticCalculation = true;

  @IsNumber()
  @Min(0)
  experienceInYears = 0;

  // @IsString()
  // @IsIn([Operation.Update, Operation.Remove, Operation.Update])
  // operation: Operation;
}

export class PatchProjectMembershipDto {
  @IsOptional()
  @IsString()
  description?: string;

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
