import { Page } from "../../utils/constants";

export class CommentVo {
  id: number;
  commentatorId: number;
  commentatorName: number;
  commentatorAvatarImageLink: string;
  commentContent: string;
  likeCount: number;
  unlikeCount: number;
  childrenComment: CommentVo[];
  parentCommentId?: number;
  parentCommentatorId: number;
  parentCommentatorName: number;
  create_time: Date;
  page: Page;
}
