import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { File } from './file.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard())
  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: './files' }))
  async uploadedFile(@UploadedFile() file: File): Promise<File> {
    const createFileDto: CreateFileDto = {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
    return this.filesService.create(createFileDto);
  }

  @Get('/:id')
  async download(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const file = await this.filesService.findOne(id);
    res.download(file.path, file.originalname);
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.filesService.delete(id);
  }
}
