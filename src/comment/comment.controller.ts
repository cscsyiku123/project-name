import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { CommentRequest } from "./entity/comment.request";
import { CommentService } from "./comment.service";
import { Role, Roles } from "../utils/common/do";

@Controller("comment")
export class CommentController {

  @Inject()
  private readonly commentService: CommentService;

  @Post("/replyComment")
  async createComment(@Body() commentRequest: CommentRequest, @Req() req) {
    commentRequest.commentatorId = req.user.userId ?? 0;
    return this.commentService.replyCommentByPostId(commentRequest);
  }

  @Post("/findCommentByPostId")
  async findCommentByPostId(@Body() commentRequest: CommentRequest) {
    return this.commentService.findCommentByPostId(commentRequest);
  }

  @Post("/deleteCommentByCommentId")
  @Roles([Role.LOGIN])
  async deleteCommentByCommentId(@Body() commentRequest: CommentRequest, @Req() req) {
    commentRequest.commentatorId = req.user.userId;
    return this.commentService.deleteCommentByCommentId(commentRequest);
  }
}
