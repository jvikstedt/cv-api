import { IsOptional, IsObject, IsString } from 'class-validator';

export class ExportDocxDto {
  @IsOptional()
  @IsObject()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any = {};

  @IsString()
  fileId: string;
}
