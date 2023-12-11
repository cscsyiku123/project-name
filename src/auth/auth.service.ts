import { HttpException, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserSignInType } from "../utils/constants";
import { UserSignInDto } from "./auth.signIn.dto";

@Injectable()
export class AuthService {
  @Inject()
  private usersService: UsersService;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private configService: ConfigService;

  public async signIn(signInDto: UserSignInDto): Promise<any> {
    if (signInDto.signInType == UserSignInType.PASSWORD) {
      const userSignInEntity =
        await this.usersService.signInByPassword(signInDto);
      if (userSignInEntity?.password !== signInDto.password) {
        throw new HttpException("用户名或密码错误", -1);
      }
      const { userId, ...result } = userSignInEntity;
      let userEntity = await this.usersService.findOneById(userId);
      if (!userEntity) {
        throw new HttpException("用户不存在", -1);
      }
      const payload = {
        sub: userEntity.id,
        username: userEntity.name,
        avater: userEntity.avatarImageLink
      };
      return {
        access_token: await this.jwtService.sign(payload)
      };
    } else if (signInDto.signInType == UserSignInType.SMS) {
      throw new HttpException("暂不支持短信登录", -1);
    }
  }
}
