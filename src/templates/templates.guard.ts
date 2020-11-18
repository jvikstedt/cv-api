import * as R from 'ramda';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ADMIN_ROLE } from '../constants';
import { TemplateRepository } from './template.repository';

@Injectable()
export class TemplatesGuard implements CanActivate {
  constructor(private templateRepository: TemplateRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (user) {
      // Allow if user has ADMIN_ROLE
      if (R.includes(ADMIN_ROLE, user.roles)) {
        return true;
      }

      // Check if user owns template
      const templateId = parseInt(request.params.templateId, 10);
      if (templateId) {
        const template = await this.templateRepository.findOne(templateId);
        if (template && R.equals(template.userId, user.userId)) {
          return true;
        }
      } else {
        // Accessing create or findAll endpoint
        return true;
      }
    }

    return false;
  }
}
