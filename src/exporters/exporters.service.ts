import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { ExportPdfDto } from './dto/export-pdf.dto';

@Injectable()
export class ExportersService {
  async exportPdf(exportPdfDto: ExportPdfDto): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(exportPdfDto.content);
    const buffer = await page.pdf({
      scale: exportPdfDto.scale,
      displayHeaderFooter: exportPdfDto.displayHeaderFooter,
      headerTemplate: exportPdfDto.headerTemplate,
      footerTemplate: exportPdfDto.footerTemplate,
      printBackground: exportPdfDto.printBackground,
      landscape: exportPdfDto.landscape,
      pageRanges: exportPdfDto.pageRanges,
      format: exportPdfDto.format as puppeteer.PDFFormat,
      width: exportPdfDto.width,
      height: exportPdfDto.height,
      margin: {
        top: exportPdfDto.marginTop,
        right: exportPdfDto.marginRight,
        bottom: exportPdfDto.marginBottom,
        left: exportPdfDto.marginLeft,
      },
      preferCSSPageSize: exportPdfDto.preferCSSPageSize,
    });
    await browser.close();
    return buffer;
  }
}
