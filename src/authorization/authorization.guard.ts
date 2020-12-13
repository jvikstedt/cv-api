import * as R from 'ramda';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Type,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { JwtPayload } from '../auth/jwt-payload.interface';
import {
  ADMIN_ROLE,
  ROUTE_METADATA_ALLOW_AUTHENTICATED,
  ROUTE_METADATA_IS_PUBLIC,
  ROUTE_METADATA_POLICIES,
  ROUTE_METADATA_POLICIES_REQUIRE_ALL,
} from '../constants';

export interface PolicyParams {
  [key: string]: string;
}

export interface IPolicyHandler {
  allow(user: JwtPayload, params: PolicyParams): Promise<boolean>;
}

export type PolicyHandler = Type<IPolicyHandler>;

// How to configure routes
// By default only admins allowed
// @Public() - Are requests are allowed
// @Authenticated() - Authenticated are allowed
// @CheckPolicies(CustomPolicy) - Requests that passes policy check are allowed

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    const params = request.params;

    const isPublic = this.reflector.get<boolean>(
      ROUTE_METADATA_IS_PUBLIC,
      context.getHandler(),
    );

    const policies =
      this.reflector.get<PolicyHandler[]>(
        ROUTE_METADATA_POLICIES,
        context.getHandler(),
      ) || [];

    const allowAuthenticated = this.reflector.get<boolean>(
      ROUTE_METADATA_ALLOW_AUTHENTICATED,
      context.getHandler(),
    );

    const requireAll =
      this.reflector.get<boolean>(
        ROUTE_METADATA_POLICIES_REQUIRE_ALL,
        context.getHandler(),
      ) || true;

    // Allow if user is admin
    if (R.includes(ADMIN_ROLE, user.roles || [])) {
      return true;
    }

    if (R.isEmpty(policies)) {
      // Allow if route is public
      if (isPublic) {
        return true;
      }

      // Allow if route is allowed for authenticated
      if (allowAuthenticated && user) {
        return true;
      }
    }

    if (!user) {
      this.logger.debug('User was not specified, but route is not public');
      return false;
    }

    if (R.isEmpty(policies)) {
      this.logger.debug('Empty policies, only admins allowed');
      return false;
    }

    let passed = 0;

    for (const policyType of policies) {
      const policy = this.moduleRef.get(policyType, {
        strict: false,
      });

      const allow = await policy.allow(user, params);
      if (allow) {
        passed = passed + 1;
      }
    }

    // Require all policies to pass
    if (requireAll) {
      return R.equals(passed, R.length(policies));
    }

    // Require one policy to pass
    return passed > 0;
  }
}
