import { CommonValidStatus } from "../../common/dto/constants";
import { Page } from "../../common/dto";

export class VideoRequest {
  videoId?: number;
  name?: string;
  brief?: string;
  coverImageLink?: string;
  categoryTag?: string;
  secondDuration?: number;
  playCount?: number;
  likeCount?: number;
  followCount?: number;
  commentCount?: number;
  shareCount?: number;
  playLink?: string;
  authorId?: number;
  validStatus?: CommonValidStatus;
  createTime?: Date;
  updateTime?: Date;
  page?: Page;
}
