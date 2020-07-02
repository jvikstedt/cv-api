import { File } from './file.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  async createFile(createFileDto: CreateFileDto): Promise<File> {
    const { originalname, encoding, mimetype, destination, filename, path, size } = createFileDto;

    const file = this.create({
      id: filename,
      originalname,
      encoding,
      mimetype,
      destination,
      filename,
      path,
      size,
    });
    return file.save();
  }
}
