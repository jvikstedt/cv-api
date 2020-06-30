import { IsNotEmpty, IsIn } from 'class-validator';

export class CreateTemplateRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsIn(['pdf'])
  exporter: "pdf";

  @IsNotEmpty()
  data: any;
}
