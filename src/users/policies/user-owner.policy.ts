import * as R from 'ramda';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';

export default class UserOwnerPolicy implements IPolicyHandler {
  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const userId = Number(params.userId);

    if (!userId) {
      return false;
    }

    return R.equals(userId, user.userId);
  }
}
