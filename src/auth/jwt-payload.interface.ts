export interface JwtPayload {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  cvIds: number[];
  templateIds: number[];
  roles: string[];
}
