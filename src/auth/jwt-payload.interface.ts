export interface JwtPayload {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  cvIds: number[];
  roles: string[];
}
