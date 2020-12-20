import { IsNumber } from 'class-validator';

export class MergeSkillSubjectsDto {
  @IsNumber()
  sourceId: number;

  @IsNumber()
  targetId: number;
}
