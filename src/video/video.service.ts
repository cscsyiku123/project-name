import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { VideoEntity } from "./entity";
import { CommonValidStatus } from "../utils/constants";
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { VideoRequest } from "./entity/video.request";

@Injectable()
export class VideoService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async findVideoByVideoId(videoRequest: VideoRequest): Promise<any> {
    return this.entityManager
      .createQueryBuilder()
      .from(VideoEntity, "video")
      .where({
        id: videoRequest.videoId,
        validStatus: CommonValidStatus.VALID
      })
      .getOne();
  }

  async deleteVideoByVideoId(videoRequest: VideoRequest): Promise<any> {
    return this.entityManager
      .createQueryBuilder()
      .from(VideoEntity, "video")
      .update({
        validStatus: CommonValidStatus.DELETE
      })
      .where({
        id: videoRequest.videoId,
        validStatus: CommonValidStatus.VALID,
        authorId: videoRequest.authorId
      })
      .execute();
  }

  async updateVideoByVideoId(videoRequest: VideoRequest): Promise<any> {
    return this.entityManager
      .createQueryBuilder()
      .from(VideoEntity, "video")
      .insert()
      .into(VideoEntity)
      .values({
        name: videoRequest.name,
        brief: videoRequest.brief,
        coverImageLink: videoRequest.coverImageLink,
        categoryTag: videoRequest.categoryTag,
        secondDuration: videoRequest.secondDuration,
        authorId: videoRequest.authorId
      })
      .execute();
  }

  async findVideoByAuthorId(videoRequest: VideoRequest) {
    return this.entityManager
      .createQueryBuilder()
      .from(VideoEntity, "video")
      .where({
        authorId: videoRequest.authorId,
        validStatus: CommonValidStatus.VALID
      })
      .getMany();
  }

  async uploadVideo(videoRequest: VideoRequest): Promise<number> {
    return this.entityManager
      .createQueryBuilder()
      .insert()
      .into(VideoEntity)
      .values([
        {
          name: videoRequest.name,
          brief: videoRequest.brief,
          categoryTag: videoRequest.categoryTag,
          authorId: videoRequest.authorId
        }
      ])
      .execute().then((result) => {
        return result.raw.affectedRows;
      });
  }
}
