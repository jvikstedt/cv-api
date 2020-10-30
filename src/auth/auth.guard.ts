/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROUTE_METADATA_IS_PUBLIC } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Public = (): any => SetMetadata(ROUTE_METADATA_IS_PUBLIC, true);

@Injectable()
export class MyAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: Error, user: any, _: any, context: ExecutionContext): any {
    const isPublic = this.reflector.get<boolean>(
      ROUTE_METADATA_IS_PUBLIC,
      context.getHandler(),
    );

    if (isPublic) {
      return user;
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
