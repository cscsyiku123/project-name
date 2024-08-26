import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { VideoEntity } from "./entity";
import { CommonValidStatus } from "../common/dto/constants";
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { VideoRequest } from "./entity/video.request";
import { UsersService } from "../users/users.service";
import { VideoVo } from "./entity/video.vo";
import { objectConvert } from "../common/utils";
import { Page } from "../common/dto";

@Injectable()
export class VideoService {
  @InjectEntityManager()
  private entityManager: EntityManager;
  @Inject()
  private readonly usersService: UsersService;

  async findVideoByVideoId(videoRequest: VideoRequest) {
    return this.entityManager
      .createQueryBuilder()
      .select("video")
      .from(VideoEntity, "video")
      .where({
        id: videoRequest.videoId,
        validStatus: CommonValidStatus.VALID
      })
      .getOne()
      .then((result) => {
        const videoVo = objectConvert<VideoVo>(result);
        return this.usersService
          .findByIds(Array(result.authorId))
          .then((userIdMap) => {
            videoVo.authorName = userIdMap.get(result.authorId)?.name;
            videoVo.authorBrief = userIdMap.get(result.authorId)?.brief;
            videoVo.authorAvatarImageLink = userIdMap.get(result.authorId)?.avatarImageLink;
            return videoVo;
          });
      });
  }

  async deleteVideoByVideoId(videoRequest: VideoRequest) {
    return this.entityManager
      .createQueryBuilder()
      .select("video")
      .from(VideoEntity, "video")
      .update({
        validStatus: CommonValidStatus.DELETE
      })
      .where({
        id: videoRequest.videoId,
        validStatus: CommonValidStatus.VALID,
        authorId: videoRequest.authorId
      })
      .execute()
      .then((result) => {
        return result.affected;
      });
  }

  async updateVideoByVideoId(videoRequest: VideoRequest) {
    return this.entityManager
      .createQueryBuilder()
      .select("video")
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
      .select("video")
      .from(VideoEntity, "video")
      .where({
        authorId: videoRequest.authorId,
        validStatus: CommonValidStatus.VALID
      })
      .getMany()
      .then((result) => {
        const videoVo = objectConvert<VideoVo[]>(result);
        this.usersService
          .findByIds(videoVo.map((v) => v.authorId))
          .then((userIdMap) => {
            videoVo.map((v) => {
              v.authorName = userIdMap.get(v.authorId)?.name;
              v.authorBrief = userIdMap.get(v.authorId)?.brief;
              v.authorAvatarImageLink = userIdMap.get(v.authorId)?.avatarImageLink;
            });
          });
        return videoVo;
      });
  }

  async uploadVideo(videoRequest: VideoRequest) {
    return this.entityManager
      .createQueryBuilder()
      .insert()
      .into(VideoEntity)
      .values([
        {
          name: videoRequest.name,
          brief: videoRequest.brief,
          categoryTag: videoRequest.categoryTag,
          authorId: videoRequest.authorId,
          coverImageLink: videoRequest.coverImageLink,
          playLink: videoRequest.playLink
        }
      ])
      .execute()
      .then((result) => {
        return result.raw.affectedRows as number;
      });
  }

  async findVideoByRecommand(videoRequest: VideoRequest) {
    return this.entityManager
      .createQueryBuilder()
      .select("video")
      .from(VideoEntity, "video")
      .where({
        validStatus: CommonValidStatus.VALID
      })
      .orderBy("video.playCount", "DESC")
      .addOrderBy("video.likeCount", "DESC")
      .addOrderBy("video.createTime", "DESC")
      .skip(Page.getSkip(videoRequest.page))
      .take(videoRequest.page.pageSize)
      .getManyAndCount()
      .then((result) => {
        let r = new VideoVo();
        r.page = Page.getPage(videoRequest.page, result[1]);
        r.detail = objectConvert<VideoVo[]>(result[0]);
        return this.usersService
          .findByIds(r.detail.map((v) => v.authorId))
          .then((userIdMap) => {
            r.detail.map((v) => {
              v.authorName = userIdMap.get(v.authorId)?.name;
              v.authorBrief = userIdMap.get(v.authorId)?.brief;
              v.authorAvatarImageLink = userIdMap.get(v.authorId)?.avatarImageLink;
            });
            return r;
          });
      });
  }
}
