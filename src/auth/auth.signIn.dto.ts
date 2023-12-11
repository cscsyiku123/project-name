import { UserSignInType } from "../utils/constants";

export class UserSignInDto {

  signInType: UserSignInType;
  account: string;
  password: string;

}
