import { SetMetadata } from '@nestjs/common';
import {
  ROUTE_METADATA_ALLOW_AUTHENTICATED,
  ROUTE_METADATA_POLICIES,
  ROUTE_METADATA_POLICIES_REQUIRE_ALL,
} from '../constants';
import { PolicyHandler } from './authorization.guard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CheckPolicies = (...policies: PolicyHandler[]): any =>
  SetMetadata(ROUTE_METADATA_POLICIES, policies);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CheckPoliciesRequireAll = (requireAll: boolean): any =>
  SetMetadata(ROUTE_METADATA_POLICIES_REQUIRE_ALL, requireAll);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Authenticated = (): any =>
  SetMetadata(ROUTE_METADATA_ALLOW_AUTHENTICATED, true);
