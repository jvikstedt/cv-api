import { IsNotEmpty } from 'class-validator';

export class UpdateTemplateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  data: any;
}
