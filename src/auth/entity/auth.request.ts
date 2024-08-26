import { AccountSignUpType } from "../../common/dto/constants";

export class AuthRequest {
  signInType: AccountSignUpType;
  account: string;
  password: string;
  userId: number;
}
