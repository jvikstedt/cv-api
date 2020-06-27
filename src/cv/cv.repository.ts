import { CV } from './cv.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCVDto } from './dto/create-cv.dto';

@EntityRepository(CV)
export class CVRepository extends Repository<CV> {
  async createCV(createCVDto: CreateCVDto): Promise<CV> {
    const { userId, description } = createCVDto;

    const cv = this.create({ userId, description });
    return cv.save();
  }
}
