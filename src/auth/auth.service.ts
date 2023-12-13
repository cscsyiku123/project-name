import { HttpException, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AccountSignUpType } from "../utils/constants";
import { AuthRequest } from "./auth.request";

@Injectable()
export class AuthService {
  @Inject()
  private usersService: UsersService;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private configService: ConfigService;

  public async signIn(authRequest: AuthRequest): Promise<any> {
    if (authRequest.signInType == AccountSignUpType.PASSWORD) {
      const accountEntity =
        await this.usersService.findOneAccount(authRequest);
      if (accountEntity?.password !== authRequest.password) {
        throw new HttpException("用户名或密码错误", -1);
      }
      const { userId, ...result } = accountEntity;
      let userEntity = await this.usersService.findOneById(userId);
      if (!userEntity) {
        throw new HttpException("用户不存在", -1);
      }
      const payload = {
        sub: userEntity.id,
        userId: userEntity.id,
        username: userEntity.name,
        avater: userEntity.avatarImageLink
      };
      return {
        access_token: await this.jwtService.sign(payload)
      };
    } else if (authRequest.signInType == AccountSignUpType.SMS) {
      throw new HttpException("暂不支持短信登录", -1);
    }
  }

  async signUp(authRequest: AuthRequest) {
    switch (authRequest.signInType) {
      case AccountSignUpType.PASSWORD:
        this.usersService.findOneAccount(authRequest).then((accountEntity) => {
          if (accountEntity) {
            throw new HttpException("用户名已存在", -1);
          } else {
            return this.usersService.addUser(authRequest);
          }
        }).then((userEntity) => {
          authRequest.userId = userEntity.id;
          return this.usersService.addAccount(authRequest);
        }).then((accountEntity) => {
          this.signIn(authRequest);
        });
        break;
      case AccountSignUpType.SMS:
        throw new HttpException("暂不支持短信注册", -1);
    }
  }
}
