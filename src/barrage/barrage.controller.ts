import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { BarrageService } from "./barrage.service";
import { BarrageRequest } from "./entity/barrage.request";
import { Role, RoleEnum } from "../common/dto";

@Controller("barrage")
export class BarrageController {
  @Inject()
  private readonly barrageService: BarrageService;


  @Post("/findBarrageBySecondRang")
  async findBarrageBySecondRang(@Body() barrageRequest: BarrageRequest) {
    return this.barrageService.findBarrageBySecondRang(barrageRequest);
  }

  @Post("/sendBarrage")
  async sendBarrage(@Body() barrageRequest: BarrageRequest) {
    return this.barrageService.sendBarrage(barrageRequest);
  }

  @Post("/deleteBarrageById")
  @Role([RoleEnum.USER])
  async deleteBarrageById(@Body() barrageRequest: BarrageRequest, @Req() req) {
    barrageRequest.commentatorId = req.user.userId;
    return this.barrageService.deleteBarrageById(barrageRequest);
  }


}
