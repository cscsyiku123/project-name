import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, Roles } from './auth.decorator';
import { UserSignInDto } from './auth.signIn.dto';

class UserLoginEntity {}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: UserSignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Roles([Role.LOGIN])
  @Get('profile')
  getProfile(@Req() req) {
    let user = req.user;
    return user;
  }
}
