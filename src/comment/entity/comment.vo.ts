import { Page } from "../../utils/common/do/page.dto";

export class CommentVo {
  id: number;
  commentatorId: number;
  commentatorName: string;
  commentatorAvatarImageLink: string;
  commentContent: string;
  likeCount: number;
  unlikeCount: number;
  childrenComment: CommentVo[];
  parentCommentId?: number;
  parentCommentatorId: number;
  parentCommentatorName: string;
  createTime: Date;
  page: Page;
}
