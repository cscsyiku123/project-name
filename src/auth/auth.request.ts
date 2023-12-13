import { AccountSignUpType } from "../utils/constants";

export class AuthRequest {
  signInType: AccountSignUpType;
  account: string;
  password: string;
  userId: number;
}
