import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { BarrageRequest } from "./entity/barrage.request";
import { BarrageEntity } from "./entity";

@Injectable()
export class BarrageService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async findBarrageBySecondRang(barrageRequest: BarrageRequest): Promise<any[]> {
    return this.entityManager.createQueryBuilder().from(BarrageEntity, "barrage")
      .where({
        videoId: barrageRequest.videoId,
        secondAppears: LessThanOrEqual(barrageRequest.endSecond),
      })
      .andWhere({
          secondAppears: MoreThanOrEqual(barrageRequest.startSecond),
        })
      .getMany();
  }

}
