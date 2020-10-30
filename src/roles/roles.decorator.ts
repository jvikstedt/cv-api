import { SetMetadata } from '@nestjs/common';
import {
  ROUTE_METADATA_ALLOWED_ROLES,
  ROUTE_METADATA_ALLOW_AUTHENTICATED,
  ROUTE_METADATA_ALLOW_CV_OWNER,
  ROUTE_METADATA_ALLOW_USER_OWNER,
} from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Roles = (...roles: string[]): any =>
  SetMetadata(ROUTE_METADATA_ALLOWED_ROLES, roles);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AllowCVOwner = (): any =>
  SetMetadata(ROUTE_METADATA_ALLOW_CV_OWNER, true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AllowUserOwner = (): any =>
  SetMetadata(ROUTE_METADATA_ALLOW_USER_OWNER, true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AllowAuthenticated = (): any =>
  SetMetadata(ROUTE_METADATA_ALLOW_AUTHENTICATED, true);
