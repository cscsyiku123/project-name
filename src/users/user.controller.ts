import { Controller, Inject, Post, Req } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { UserVo } from "../users/entity";
import { JwtPayLoadDTO, Role, Roles } from "../utils/common/do";


@Controller("user")
export class UserController {
  @Inject()
  private userService: UsersService;

  @Roles([Role.LOGIN])
  @Post("profile")
  getProfile(@Req() req) {
    let jwtPayLoad = req.user as JwtPayLoadDTO;
    return this.userService.findOneById(jwtPayLoad.userId).then((e) => {
      return new UserVo(e.id, e.name, e.avatarImageLink);
    });
  }
}
