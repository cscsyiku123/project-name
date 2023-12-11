import { Page } from '../../utils/constants';

export class CommentRequest {
  id: number;
  commentatorId: number;
  commentatorName: number;
  commentatorAvatarImageLink: string;
  commentContent: string;
  likeCount: number;
  unlikeCount: number;
  childrenComment: CommentRequest[];
  parentCommentId?: number;
  parentCommentatorId: number;
  parentCommentatorName: number;
  create_time: Date;
  page: Page;
  postId: number;
  postType: number;
}
