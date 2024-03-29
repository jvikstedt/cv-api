import { InjectRepository } from '@nestjs/typeorm';
import * as R from 'ramda';
import * as puppeteer from 'puppeteer';
import * as nunjucks from 'nunjucks';
import createReport from 'docx-templates';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    try {
      nunjucks.configure({ autoescape: true });
      const content = nunjucks.renderString(
        exportPdfDto.bodyTemplate,
        exportPdfDto.data,
      );

      // FIXME
      // --no-sandbox is security risk
      // https://stackoverflow.com/a/53975412
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
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
    } catch (err) {
      console.log(err.toString());
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: err.toString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async exportDocx(exportDocxDto: ExportDocxDto): Promise<Uint8Array> {
    const fileId = exportDocxDto.fileId;
    const template = fs.readFileSync(`./files/${fileId}`);

    try {
      const buffer = await createReport({
        template,
        data: exportDocxDto.data,
        cmdDelimiter: ['{{', '}}'],
        processLineBreaks: false,
        additionalJsContext: {
          R,
          image: async (
            id: string,
            width: number,
            height: number,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ): Promise<any> => {
            let extension: string;
            let file: Buffer;
            if (!id) {
              extension = '.jpg';
              file = fs.readFileSync(`./static/no-image.jpg`);
            } else {
              const entity = await this.fileRepository.findOne(id);
              if (!entity) {
                return null;
              }
              extension = path.extname(entity.originalname);
              file = fs.readFileSync(`./files/${id}`);
            }

            return { width, height, data: file, extension };
          },
          formatYearMonth: (
            month: number | null,
            year: number | null,
          ): string => {
            if (month && year) {
              return `${month}.${year}`;
            }

            return `${month ? month : ''}${year ? year : ''}`;
          },
        },
      });

      return buffer;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: err.toString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
