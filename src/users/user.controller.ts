import { Controller, Inject, Post, Req } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { UserVo } from "../users/entity";
import { JwtPayLoadDTO, Role, RoleEnum } from "../common/dto";
import { objectConvert } from "../common/utils";


@Controller("user")
export class UserController {
  @Inject()
  private userService: UsersService;

  @Role([RoleEnum.USER])
  @Post("profile")
  getProfile(@Req() req) {
    let jwtPayLoad = req.user as JwtPayLoadDTO;
    return this.userService.findOneById(jwtPayLoad.userId).then((e) => {
      let userVo = objectConvert<UserVo>(e);
      userVo.userId = e.id;
      userVo.userName = e.name;
      return userVo;
    });
  }
}
