import { IsNotEmpty, IsIn, IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(['pdf'])
  exporter: "pdf";

  @IsNotEmpty()
  data: any;
}
