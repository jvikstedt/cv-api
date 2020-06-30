import { IsNotEmpty, Min, Max, IsNumber, IsBoolean, IsString, IsIn } from 'class-validator';

const ALLOWED_FORMATS = ["", "Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"];

export class ExportPdfDto {
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @Min(0.1)
  @Max(2)
  scale? = 1;

  @IsBoolean()
  displayHeaderFooter? = false;

  @IsString()
  headerTemplate? = "";

  @IsString()
  footerTemplate? = "";

  @IsBoolean()
  printBackground? = false;

  @IsBoolean()
  landscape? = false;

  @IsString()
  pageRanges? = "";

  @IsString()
  @IsIn(ALLOWED_FORMATS)
  format? = "Letter";

  @IsString()
  width? = "";

  @IsString()
  height? = "";

  @IsString()
  marginTop? = "0px";

  @IsString()
  marginRight? = "0px";

  @IsString()
  marginBottom? = "0px";

  @IsString()
  marginLeft? = "0px";

  @IsBoolean()
  preferCSSPageSize? = false;
}
