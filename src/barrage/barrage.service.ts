import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { EntityManager } from "typeorm";

@Injectable()
export class BarrageService {
  @InjectEntityManager()
  private entityManager: EntityManager;


  async findBarrageBy(roomId: number): Promise<any[]> {
    return this.entityManager.createQueryBuilder().from("barrage", "barrage")
      .addOrderBy("barrage.createTime", "ASC")
      .where({
        roomId: roomId
      }).getMany();
  }

}
