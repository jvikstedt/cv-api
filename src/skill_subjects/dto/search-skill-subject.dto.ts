import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchSkillSubjectDto {
  @IsOptional()
  @IsString()
  name?: string = '';

  @IsOptional()
  @IsNumber()
  skillGroupId?: number;

  @IsOptional()
  @IsNumber()
  take?: number = 10;

  @IsOptional()
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @IsString()
  orderColumnName?: string = 'skillSubject.name';

  @IsOptional()
  @IsString()
  orderSort?: 'ASC' | 'DESC' = 'ASC';
}
