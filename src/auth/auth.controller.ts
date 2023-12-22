import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Role, Roles } from "./auth.decorator";
import { AuthRequest } from "./auth.request";
import { JwtPayLoadDTO } from "./jwt.dto";
import { UsersService } from "../users/users.service";

class UserLoginEntity {
}

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

  @Roles([Role.LOGIN])
  @Get("profile")
  getProfile(@Req() req) {
    let jwtPayLoad = req.user as JwtPayLoadDTO;
    return this.userService.findOneById(jwtPayLoad.userId);
  }
}
