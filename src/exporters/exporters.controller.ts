import { Controller, Post, Body, Res, Header, UseGuards, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import * as stream from 'stream';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExportersService } from './exporters.service';
import { ExportPdfDto } from './dto/export-pdf.dto';
import {ExportDocxDto} from './dto/export-docx.dto';

@ApiBearerAuth()
@ApiTags('exporters')
@Controller('exporters')
@UseGuards(AuthGuard())
export class ExportersController {
  constructor(
    private readonly exportersService: ExportersService,
  ) {}

  @Post('/pdf/export')
  @Header('Content-Type', 'application/pdf')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  exportPdf(@Res() res: Response, @Body() exportPdfDto: ExportPdfDto) {
    this.exportersService.exportPdf(exportPdfDto)
      .then(response => {
        res.send(response);
      });
  }

  @Post('/docx/export')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  exportDocx(@Res() res: Response, @Body() exportDocxDto: ExportDocxDto) {
    this.exportersService.exportDocx(exportDocxDto)
      .then(response => {
        const readStream = new stream.PassThrough();
        readStream.end(response);
        res.set("Content-disposition", 'attachment; filename=' + "output.docx");
        res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        readStream.pipe(res);
      });
  }
}
