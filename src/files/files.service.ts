import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileRepository } from './file.repository';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository: FileRepository,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<File> {
    const file = await this.fileRepository.createFile(createFileDto);

    return file;
  }

  async findOne(id: string): Promise<File> {
    const entity = await this.fileRepository.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(id: string): Promise<void> {
    const result = await this.fileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
