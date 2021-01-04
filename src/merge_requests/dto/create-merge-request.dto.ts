import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMergeRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['SkillSubject'])
  entity: string;

  @IsString()
  description: string;

  @IsInt()
  @IsPositive()
  sourceId: number;

  @IsInt()
  @IsPositive()
  targetId: number;
}
