import { AccountSignUpType } from "../../common/dto/constants";

export class UserRequest {
  userId: number;
  signUpType: AccountSignUpType;
  account: string;
  password: string;

}
