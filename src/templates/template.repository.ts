import { Template } from './template.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';

@EntityRepository(Template)
export class TemplateRepository extends Repository<Template> {
  async createTemplate(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const { name, exporter, userId, data } = createTemplateDto;

    const template = this.create({
      name,
      exporter,
      userId,
      data,
    });
    return template.save();
  }
}
