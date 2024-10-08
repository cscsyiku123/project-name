import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { BarrageRequest } from "./entity/barrage.request";
import { BarrageEntity } from "./entity";
import { CommonValidStatus } from "../common/dto/constants";

@Injectable()
export class BarrageService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async findBarrageBySecondRang(barrageRequest: BarrageRequest) {
    let barrageEntities = await this.entityManager
      .createQueryBuilder()
      .select("barrage")
      .from(BarrageEntity, "barrage")
      .where({
        postId: barrageRequest.postId,
        postType: barrageRequest.postType,
        secondAppears: LessThanOrEqual(barrageRequest.endSecond)
      })
      .andWhere({
        secondAppears: MoreThanOrEqual(barrageRequest.startSecond)
      })
      .getMany();
    console.log(`barrageEntities: ${JSON.stringify(barrageEntities)}`);
    return barrageEntities;
  }

  async sendBarrage(barrageRequest: BarrageRequest): Promise<number> {
    return this.entityManager
      .createQueryBuilder()
      .insert()
      .into(BarrageEntity)
      .values({
        postId: barrageRequest.postId,
        postType: barrageRequest.postType,
        secondAppears: barrageRequest.secondAppears,
        commentContent: barrageRequest.commentContent,
        commentatorId: barrageRequest.commentatorId
      })
      .execute().then((result) => {
        return result.raw.affectedRows;
      });
  }

  async deleteBarrageById(barrageRequest: BarrageRequest) {
    return this.entityManager
      .createQueryBuilder()
      .select("barrage")
      .from(BarrageEntity, "barrage")
      .update({
        validStatus: CommonValidStatus.DELETE
      })
      .where({
        id: barrageRequest.barrageId,
        validStatus: CommonValidStatus.VALID,
        commentatorId: barrageRequest.commentatorId
      })
      .execute()
      .then((result) => {
        return result.affected;
      });
  }
}
