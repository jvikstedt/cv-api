import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchMergeRequestDto {
  @IsOptional()
  @IsNumber()
  take?: number = 10;

  @IsOptional()
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @IsString()
  orderColumnName?: string = 'mergeRequest.createdAt';

  @IsOptional()
  @IsString()
  orderSort?: 'ASC' | 'DESC' = 'ASC';
}
