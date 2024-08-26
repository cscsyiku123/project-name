import { Page } from "../../common/dto/page.dto";
import { PostType } from "../../common/dto/constants";

export class CommentRequest {
  commentId?: number;
  commentatorId?: number;
  commentatorName?: number;
  commentatorAvatarImageLink?: string;
  commentContent?: string;
  likeCount?: number;
  unlikeCount?: number;
  childrenComment?: CommentRequest[];
  parentCommentId?: number;
  parentCommentatorId?: number;
  parentCommentatorName?: number;
  createTime?: Date;
  page?: Page;
  postId?: number;
  postType?: PostType;
}
