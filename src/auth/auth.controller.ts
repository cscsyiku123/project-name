import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Role, Roles } from "./auth.decorator";
import { AuthRequest } from "./auth.request";

class UserLoginEntity {
}

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @HttpCode(HttpStatus.OK)
  @Post("signIn")
  signIn(@Body() authRequest: AuthRequest) {
    return this.authService.signIn(authRequest);
  }

  @Post("signUp")
  signUp(@Body() authRequest: AuthRequest) {
    return this.authService.signUp(authRequest);
  }

  @Roles([Role.LOGIN])
  @Get("profile")
  getProfile(@Req() req) {
    let user = req.user;
    return user;
  }
}
