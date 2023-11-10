import { HttpException, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  @Inject()
  private usersService: UsersService;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private configService: ConfigService;

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new HttpException("用户名或密码错误", -1);
    }
    const { password, ...result } = user;
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.sign(payload)
    };

  }
}
