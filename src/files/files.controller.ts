import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { File } from './file.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { Public } from '../auth/auth.guard';
import { Authenticated } from '../authorization/authorization.decorator';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Authenticated()
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

  // FIXME consider removing public and figuring out proper way to access this
  @Public()
  @Get('/:fileId')
  async download(
    @Param('fileId') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.filesService.findOne(id);
    res.download(file.path, file.originalname);
  }

  @Delete('/:fileId')
  delete(@Param('fileId') id: string): Promise<void> {
    return this.filesService.delete(id);
  }
}
