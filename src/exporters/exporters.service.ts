import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import * as nunjucks from "nunjucks";
import createReport from 'docx-templates';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportPdfDto } from './dto/export-pdf.dto';
import { ExportDocxDto } from './dto/export-docx.dto';
import { FileRepository } from '../files/file.repository';

@Injectable()
export class ExportersService {
  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository: FileRepository,
  ) {}

  async exportPdf(exportPdfDto: ExportPdfDto): Promise<Buffer> {
    nunjucks.configure({ autoescape: true });

    const content = nunjucks.renderString(
      exportPdfDto.bodyTemplate,
      exportPdfDto.data
    );

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(content);
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

  async exportDocx(exportDocxDto: ExportDocxDto): Promise<Uint8Array> {
    const fileId = exportDocxDto.fileId;
    const template = fs.readFileSync(`./files/${fileId}`);

    const buffer = await createReport({
      template,
      data: exportDocxDto.data,
      additionalJsContext: {
        image: async (id: string, width: number, height: number) => {
          const entity = await this.fileRepository.findOne(id);
          if (!entity) {
            throw new NotFoundException();
          }
          const extension = path.extname(entity.originalname)
          const file = fs.readFileSync(`./files/${id}`);

          return { width, height, data: file, extension };
        },
      }
    });

    return buffer;
  }
}
