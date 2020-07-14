import * as R from 'ramda';
import { JwtService } from "@nestjs/jwt";
import { User } from "../src/users/user.entity";
import { JwtPayload } from "../src/auth/jwt-payload.interface";

export const generateAccessToken = (jwtService: JwtService, user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    cvIds: [user.cv.id],
    templateIds: R.map(t => t.id, user.templates),
  };
  return jwtService.sign(payload);
}
