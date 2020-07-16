import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class PatchProjectDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}
