import { IsNotEmpty, IsIn, IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(['pdf', 'docx'])
  exporter: 'pdf' | 'docx';

  @IsNotEmpty()
  data: any;
}
