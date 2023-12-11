import { PostType } from '../../utils/constants';

export class BarrageRequest {
  startSecond: number;
  endSecond: number;
  postId: number;
  postType: PostType;
  secondAppears: number;
  commentContent: string;
  commentatorId: number;
  barrageId: number;
}
