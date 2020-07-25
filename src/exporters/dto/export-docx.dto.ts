import { IsOptional, IsObject, IsString } from 'class-validator';

export class ExportDocxDto {
  @IsOptional()
  @IsObject()
  data?: any = {};

  @IsString()
  fileId: string;
}
