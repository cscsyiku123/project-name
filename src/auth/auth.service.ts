import { HttpException, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AccountSignUpType } from "../common/dto/constants";
import { AuthRequest } from "./entity/auth.request";
import { JwtPayLoadDTO } from "../common/dto";

@Injectable()
export class AuthService {
  @Inject()
  private usersService: UsersService;
  @Inject()
  private configService: ConfigService;
  @Inject()
  private jwtService: JwtService;

  public async signIn(authRequest: AuthRequest) {
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
      const payload = new JwtPayLoadDTO(
        userEntity.id,
        userEntity.id,
        userEntity.name,
        userEntity.avatarImageLink
      );
      return {
        accessToken: this.jwtService.sign({ ...payload })
      };
    } else if (authRequest.signInType == AccountSignUpType.SMS) {
      throw new HttpException("暂不支持短信登录", -1);
    }
  }

  async signUp(authRequest: AuthRequest) {
    switch (authRequest.signInType) {
      case AccountSignUpType.PASSWORD:
        return this.usersService.findOneAccount(authRequest).then((accountEntity) => {
          if (accountEntity) {
            throw new HttpException("用户名已存在", -1);
          } else {
            return this.usersService.addUser(authRequest);
          }
        }).then((userEntity) => {
          authRequest.userId = userEntity.id;
          return this.usersService.addAccount(authRequest);
        }).then((accountEntity) => {
          return this.signIn(authRequest);
        });
        break;
      case AccountSignUpType.SMS:
        throw new HttpException("暂不支持短信注册", -1);
    }
  }
}
