import { AccountSignUpType } from "../../utils/constants";

export class UserRequest {
  userId: number;
  signUpType: AccountSignUpType;
  account: string;
  password: string;

}
