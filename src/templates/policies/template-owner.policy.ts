import { InjectRepository } from '@nestjs/typeorm';
import * as R from 'ramda';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';
import { TemplateRepository } from '../template.repository';

export default class TemplateOwnerPolicy implements IPolicyHandler {
  constructor(
    @InjectRepository(TemplateRepository)
    private templateRepository: TemplateRepository,
  ) {}

  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const templateId = Number(params.templateId);

    const template = await this.templateRepository.findOne(templateId);

    if (template && R.equals(template.userId, user.userId)) {
      return true;
    }

    return false;
  }
}
