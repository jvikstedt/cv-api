import * as R from 'ramda';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class CVGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user: JwtPayload = request.user;

    const cvId = parseInt(request.params.cvId, 10);

    if (R.includes(cvId, user.cvIds)) {
      return true;
    }

    return false;
  }
}
