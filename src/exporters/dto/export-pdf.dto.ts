import { IsNotEmpty, Min, Max, IsNumber, IsBoolean, IsString, IsIn, IsOptional, IsObject } from 'class-validator';

const ALLOWED_FORMATS = ["", "Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"];

export class ExportPdfDto {
  @IsOptional()
  @IsNotEmpty()
  bodyTemplate? = "";

  @IsOptional()
  @IsObject()
  data?: any = {};

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  scale? = 1;

  @IsOptional()
  @IsBoolean()
  displayHeaderFooter? = false;

  @IsOptional()
  @IsString()
  headerTemplate? = "";

  @IsOptional()
  @IsString()
  footerTemplate? = "";

  @IsOptional()
  @IsBoolean()
  printBackground? = false;

  @IsOptional()
  @IsBoolean()
  landscape? = false;

  @IsOptional()
  @IsString()
  pageRanges? = "";

  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_FORMATS)
  format? = "Letter";

  @IsOptional()
  @IsString()
  width? = "";

  @IsOptional()
  @IsString()
  height? = "";

  @IsOptional()
  @IsString()
  marginTop? = "0px";

  @IsOptional()
  @IsString()
  marginRight? = "0px";

  @IsOptional()
  @IsString()
  marginBottom? = "0px";

  @IsOptional()
  @IsString()
  marginLeft? = "0px";

  @IsOptional()
  @IsBoolean()
  preferCSSPageSize? = false;
}
