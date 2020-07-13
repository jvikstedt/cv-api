import * as R from 'ramda';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user: JwtPayload = request.user;

    const userId = parseInt(request.params.userId, 10);

    if (R.equals(userId, user.userId)) {
      return true;
    }

    return false;
  }
}
