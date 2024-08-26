import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { CommentEntity } from "./entity";
import { CommentRequest } from "./entity/comment.request";
import { CommentVo } from "./entity/comment.vo";
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { CommonValidStatus } from "../common/dto/constants";
import { UsersService } from "../users/users.service";
import { Page } from "../common/dto/page.dto";
import { objectConvert } from "../common/utils";

@Injectable()
export class CommentService {

  @InjectEntityManager() private entityManager: EntityManager;
  @Inject() private readonly usersService: UsersService;

  async findCommentByRootCommentId(request: CommentRequest) {
    return this.entityManager
      .createQueryBuilder()
      .select("comment")
      .from(CommentEntity, "comment")
      .addOrderBy("comment.createTime", "ASC")
      .where({
        postId: request.postId,
        postType: request.postType,
        rootCommentId: request.commentatorId,
        validStatus: CommonValidStatus.VALID
      })
      .skip((request.page.pageIndex - 1) * request.page.pageSize)
      .take(request.page.pageSize)
      .getManyAndCount()
      .then((result) => {
        return this.commentEntityToVo(result[0]).then((vo) => {
          if (vo.length > 0) {
            vo[0].page = Page.getPage(request.page, result[1]);
          }
          return vo;
        });
      });
  }

  async findCommentByPostId(request: CommentRequest) {
    return this.entityManager
      .createQueryBuilder()
      .select("comment")
      .from(CommentEntity, "comment")
      .addOrderBy("comment.createTime", "DESC")
      .where({
        postId: request.postId,
        postType: request.postType,
        rootCommentId: 0,
        validStatus: CommonValidStatus.VALID
      })
      .skip((request.page.pageIndex - 1) * request.page.pageSize)
      .take(request.page.pageSize)
      .getManyAndCount()
      .then((result) => {
        return Promise.all(result[0].map((comment) => {
          let commentVo = new CommentVo();
          commentVo.id = comment.id;
          commentVo.commentContent = comment.commentContent;
          commentVo.createTime = comment.createTime;
          commentVo.likeCount = comment.likeCount;
          commentVo.unlikeCount = comment.unlikeCount;
          commentVo.commentatorId = comment.commentatorId;
          commentVo.page = Page.getPage(request.page, result[1]);
          return this.entityManager
            .createQueryBuilder()
            .select("comment")
            .from(CommentEntity, "comment")
            .addOrderBy("comment.createTime", "ASC")
            .where({
              postId: request.postId,
              postType: request.postType,
              rootCommentId: comment.id,
              validStatus: CommonValidStatus.VALID
            })
            .skip((request.page.pageIndex - 1) * request.page.pageSize)
            .take(request.page.pageSize)
            .getManyAndCount()
            .then((result) => {
              commentVo.childrenComment = result[0].map((comment) => {
                let commentVo: CommentVo = new CommentVo();
                commentVo.id = comment.id;
                commentVo.commentContent = comment.commentContent;
                commentVo.createTime = comment.createTime;
                commentVo.likeCount = comment.likeCount;
                commentVo.unlikeCount = comment.unlikeCount;
                commentVo.commentatorId = comment.commentatorId;
                commentVo.parentCommentatorId = comment.parentCommentatorId;
                return commentVo;
              });
              commentVo.page = Page.getPage(request.page, result[1]);
              return commentVo;
            }).then((result) => {
              return commentVo;
            });
        }));
      })
      .then((result) => {
        return Promise.all(result.flatMap((commentVo) => {
          let userIdList: number[] = [];
          userIdList.push(commentVo.commentatorId);
          userIdList.push(
            ...commentVo.childrenComment.flatMap((childCommentVo) => {
              return [
                childCommentVo.commentatorId,
                childCommentVo.parentCommentatorId
              ];
            })
          );
          return this.usersService.findByIds(userIdList).then((userIdMap) => {
            result.map((commentVo) => {
              commentVo.commentatorName = userIdMap.get(commentVo.commentatorId)
                ?.name;
              commentVo.commentatorAvatarImageLink = userIdMap.get(
                commentVo.commentatorId
              )?.avatarImageLink;
              commentVo.childrenComment.map((childCommentVo) => {
                childCommentVo.commentatorName = userIdMap.get(
                  childCommentVo.commentatorId
                )?.name;
                childCommentVo.commentatorAvatarImageLink = userIdMap.get(
                  childCommentVo.commentatorId
                )?.avatarImageLink;
                childCommentVo.parentCommentatorName = userIdMap.get(
                  childCommentVo.parentCommentatorId
                )?.name;
              });
            });
            return result;
          });
        }))
          .then((resultP) => {
            let commentVo1 = new CommentVo();
            commentVo1.detail = result;
            commentVo1.page = result[0]?.page;
            return commentVo1;
          });
      });
  }

  async replyCommentByPostId(request: CommentRequest) {
    let commentEntity: CommentEntity = objectConvert<CommentEntity>(request);
    if (request.parentCommentId) {
      await this.entityManager
        .createQueryBuilder()
        .select("comment")
        .from(CommentEntity, "comment")
        .where({
          postId: request.postId,
          postType: request.postType,
          validStatus: CommonValidStatus.VALID,
          id: request.parentCommentId
        })
        .getOne()
        .then((result) => {
          if (result.rootCommentId != 0) {
            commentEntity.rootCommentId = result.rootCommentId;
          } else if (result.parentCommentId != 0) {
            commentEntity.rootCommentId = result.parentCommentId;
          } else {
            commentEntity.rootCommentId = result.id;
          }
          commentEntity.parentCommentatorId = result.commentatorId;
        });
    }

    return this.entityManager.save(CommentEntity, commentEntity).then((result) => {
      return this.commentEntityToVo(Array(result)).then((vo) => {
        let commentVo = vo[0];
        commentVo.childrenComment = [];
        return commentVo;
      });
    });
  }

  deleteCommentByCommentId(commentRequest: CommentRequest) {
    return this.entityManager.createQueryBuilder().from(CommentEntity, "comment")
      .update().set({
        validStatus: CommonValidStatus.DELETE
      })
      .where({
        id: commentRequest.commentId,
        commentatorId: commentRequest.commentatorId,
        validStatus: CommonValidStatus.VALID
      }).execute().then((result) => {
        return result.affected;
      });
  }

  private commentEntityToVo(result: CommentEntity[]) {
    let commentVoList = result.map((comment) => {
      let commentVo: CommentVo = objectConvert<CommentVo>(comment);
      return commentVo;
    });
    let userIdList: number[] = [];
    userIdList.push(
      ...commentVoList.flatMap((commentVo) => {
        return [commentVo.commentatorId, commentVo.parentCommentatorId];
      })
    );
    return this.usersService.findByIds(userIdList).then((userIdMap) => {
      commentVoList.map((commentVo) => {
        commentVo.commentatorName = userIdMap.get(commentVo.commentatorId)?.name;
        commentVo.commentatorAvatarImageLink = userIdMap.get(commentVo.commentatorId)?.avatarImageLink;
        commentVo.parentCommentatorName = userIdMap.get(commentVo.parentCommentatorId)?.name;
      });
      return commentVoList;
    });
  }
}
