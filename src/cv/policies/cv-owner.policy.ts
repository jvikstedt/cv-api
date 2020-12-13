import * as R from 'ramda';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import {
  IPolicyHandler,
  PolicyParams,
} from '../../authorization/authorization.guard';

export default class CVOwnerPolicy implements IPolicyHandler {
  async allow(user: JwtPayload, params: PolicyParams): Promise<boolean> {
    const cvId = Number(params.cvId);

    if (!cvId) {
      return false;
    }

    return R.includes(cvId, user.cvIds);
  }
}
