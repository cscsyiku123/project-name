import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRequest } from "./auth.request";
import { UsersService } from "../users/users.service";


@Controller("auth")
export class AuthController {
  @Inject()
  private authService: AuthService;
  @Inject()
  private userService: UsersService;

  @HttpCode(HttpStatus.OK)
  @Post("signIn")
  signIn(@Body() authRequest: AuthRequest) {
    return this.authService.signIn(authRequest);
  }

  @Post("signUp")
  signUp(@Body() authRequest: AuthRequest) {
    return this.authService.signUp(authRequest);
  }

}
