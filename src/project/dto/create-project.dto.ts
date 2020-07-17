import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  companyId: number;
}
