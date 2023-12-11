import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CommentEntity } from "./entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentRequest } from "./entity/comment.request";
import { CommentVo } from "./entity/comment.vo";
import { UserEntity } from "../users/entity";

@Injectable()
export class CommentService {
  @InjectRepository(CommentEntity)
  private readonly commentRepository: Repository<CommentEntity>;


  async findCommentByRootCommentId(): Promise<CommentEntity[]> {
    return this.commentRepository.find();
  }

  async findCommentByPostId(request: CommentRequest): Promise<CommentVo[]> {
    return this.commentRepository.createQueryBuilder("comment")
      .addOrderBy("comment.createTime", "DESC")
      .where({
        postId: request.postId,
        rootCommentId: null
      })

      .skip((request.page.pageIndex - 1) * request.page.pageSize)
      .take(request.page.pageSize)
      .relation("commentator")
      .of(UserEntity)

      .getManyAndCount();
    let rootCommentVo: CommentVo[] = await this.commentRepository.query(`
        select c.id              as id,
               c.comment_content as commentContent,
               c.create_time     as createTime,
               c.like_count      as likeCount,
               c.unlike_count    as unlikeCount,
               u.id              as commentatorId,
               u.name            as commentatorName,
               u.avatarImageLink as commentatorAvatar
        from comment c
                 left join user u on c.commentator_id = u.id
        where c.post_id = ${request.postId}
          and c.root_comment_id is null
        order by c.create_time desc
            limit ${(request.page.pageIndex - 1) * request.page.pageSize}, ${request.page.pageSize}
    `);

    return promise;

  }

  async replyCommentByPostId(): Promise<CommentEntity[]> {
    return this.commentRepository.find();
  }

}
