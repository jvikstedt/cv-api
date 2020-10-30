import * as R from 'ramda';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../auth/jwt-payload.interface';
import {
  ADMIN_ROLE,
  ROUTE_METADATA_ALLOWED_ROLES,
  ROUTE_METADATA_ALLOW_AUTHENTICATED,
  ROUTE_METADATA_ALLOW_CV_OWNER,
  ROUTE_METADATA_ALLOW_USER_OWNER,
  ROUTE_METADATA_IS_PUBLIC,
} from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      ROUTE_METADATA_IS_PUBLIC,
      context.getHandler(),
    );

    // Allow if route is public
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    const allowAuthenticated = this.reflector.get<boolean>(
      ROUTE_METADATA_ALLOW_AUTHENTICATED,
      context.getHandler(),
    );

    // Allow if route is allowed for authenticated users and user is authenticated
    if (user && allowAuthenticated) {
      return true;
    }

    // Allow if user has ADMIN_ROLE
    if (user && R.includes(ADMIN_ROLE, user.roles)) {
      return true;
    }

    const roles = this.reflector.get<string[]>(
      ROUTE_METADATA_ALLOWED_ROLES,
      context.getHandler(),
    );

    // Allow if user has specified roles
    if (user && roles) {
      return R.all((role) => R.includes(role, user.roles))(roles);
    }

    const allowCVOwner = this.reflector.get<boolean>(
      ROUTE_METADATA_ALLOW_CV_OWNER,
      context.getHandler(),
    );

    // Allow CV owner if specified
    if (user && allowCVOwner) {
      const cvId = parseInt(request.params.cvId, 10);
      if (R.includes(cvId, user.cvIds)) {
        return true;
      }
    }

    const allowUserOwner = this.reflector.get<boolean>(
      ROUTE_METADATA_ALLOW_USER_OWNER,
      context.getHandler(),
    );

    // Allow User owner if specified
    if (user && allowUserOwner) {
      const userId = parseInt(request.params.userId, 10);
      if (R.equals(user.userId, userId)) {
        return true;
      }
    }

    return false;
  }
}
