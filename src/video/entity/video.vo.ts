import { CommonValidStatus } from "../../common/dto/constants";
import { Page } from "../../common/dto";

export class VideoVo {
  id: number;

  name: string;

  brief: string;

  coverImageLink: string;

  categoryTag: string;

  secondDuration: number;

  playCount: number;

  likeCount: number;

  followCount: number;

  commentCount: number;

  shareCount: number;

  playLink: string;

  authorId: number;

  authorName: string;

  authorAvatarImageLink: string;

  authorBrief: string;

  validStatus: CommonValidStatus;

  createTime: Date;

  updateTime: Date;
  page: Page;

  detail: VideoVo[];

}
