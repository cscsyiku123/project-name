import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { CommentRequest } from "./entity/comment.request";
import { CommentService } from "./comment.service";
import { Role, RoleEnum } from "../common/dto";

@Controller("comment")
export class CommentController {

  @Inject()
  private readonly commentService: CommentService;

  @Post("/replyComment")
  @Role([RoleEnum.USER])
  async createComment(@Body() commentRequest: CommentRequest, @Req() req) {
    console.log(req.user);
    commentRequest.commentatorId = req.user.userId ?? 0;
    return this.commentService.replyCommentByPostId(commentRequest);
  }

  @Post("/findCommentByPostId")
  async findCommentByPostId(@Body() commentRequest: CommentRequest) {
    return this.commentService.findCommentByPostId(commentRequest);
  }

  @Post("/deleteCommentByCommentId")
  @Role([RoleEnum.USER])
  async deleteCommentByCommentId(@Body() commentRequest: CommentRequest, @Req() req) {
    commentRequest.commentatorId = req.user.userId;
    return this.commentService.deleteCommentByCommentId(commentRequest);
  }
}
