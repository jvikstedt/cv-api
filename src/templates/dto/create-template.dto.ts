import { IsNotEmpty, IsIn, IsString, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(['pdf', 'docx'])
  exporter: 'pdf' | 'docx';

  @IsNotEmpty()
  @IsBoolean()
  global = false;

  @IsNotEmpty()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
