import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { CommentEntity } from "./entity";
import { CommentRequest } from "./entity/comment.request";
import { CommentVo } from "./entity/comment.vo";
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { CommonValidStatus } from "../utils/constants";
import { UsersService } from "../users/users.service";
import { Page } from "../utils/page.dto";

@Injectable()
export class CommentService {

  @InjectEntityManager() private entityManager: EntityManager;
  @Inject() private readonly usersService: UsersService;

  async findCommentByRootCommentId(
    request: CommentRequest
  ): Promise<CommentVo[]> {
    return this.entityManager
      .createQueryBuilder()
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
        let commentVoList: CommentVo[] = [];
        let commentList: CommentEntity[] = result[0];
        let commentCount: number = result[1];
        for (let comment of commentList) {
          let commentVo: CommentVo = new CommentVo();
          commentVo.id = comment.id;
          commentVo.commentContent = comment.commentContent;
          commentVo.createTime = comment.createTime;
          commentVo.likeCount = comment.likeCount;
          commentVo.unlikeCount = comment.unlikeCount;
          commentVo.commentatorId = comment.commentatorId;
          commentVo.page = Page.getPage(request.page, commentCount);
          commentVoList.push(commentVo);
        }
        return commentVoList;
      })
      .then((result) => {
        let userIdList: number[] = [];
        userIdList.push(
          ...result.flatMap((commentVo) => {
            return [commentVo.commentatorId, commentVo.parentCommentatorId];
          })
        );
        this.usersService.findByIds(userIdList).then((userIdMap) => {
          result.map((commentVo) => {
            commentVo.commentatorName = userIdMap.get(commentVo.commentatorId)
              ?.name;
            commentVo.commentatorAvatarImageLink = userIdMap.get(
              commentVo.commentatorId
            )?.avatarImageLink;
            commentVo.parentCommentatorName = userIdMap.get(
              commentVo.parentCommentatorId
            )?.name;
          });
        });

        return result;
      });
  }

  async findCommentByPostId(request: CommentRequest): Promise<CommentVo[]> {
    return this.entityManager
      .createQueryBuilder()
      .from(CommentEntity, "comment")
      .addOrderBy("comment.createTime", "DESC")
      .where({
        postId: request.postId,
        postType: request.postType,
        rootCommentId: null,
        validStatus: CommonValidStatus.VALID
      })
      .skip((request.page.pageIndex - 1) * request.page.pageSize)
      .take(request.page.pageSize)
      .getManyAndCount()
      .then((result) => {
        let commentVoList: CommentVo[] = [];
        let commentList: CommentEntity[] = result[0];
        let commentCount: number = result[1];
        for (let comment of commentList) {
          let commentVo: CommentVo = new CommentVo();
          commentVo.id = comment.id;
          commentVo.commentContent = comment.commentContent;
          commentVo.createTime = comment.createTime;
          commentVo.likeCount = comment.likeCount;
          commentVo.unlikeCount = comment.unlikeCount;
          commentVo.commentatorId = comment.commentatorId;
          commentVo.page = Page.getPage(request.page, commentCount);
          this.entityManager
            .createQueryBuilder()
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
              let childCommentVoList: CommentVo[] = [];
              let commentList: CommentEntity[] = result[0];
              let commentCount: number = result[1];
              for (let comment of commentList) {
                let commentVo: CommentVo = new CommentVo();
                commentVo.id = comment.id;
                commentVo.commentContent = comment.commentContent;
                commentVo.createTime = comment.createTime;
                commentVo.likeCount = comment.likeCount;
                commentVo.unlikeCount = comment.unlikeCount;
                commentVo.commentatorId = comment.commentatorId;
                commentVo.parentCommentatorId = comment.parentCommentatorId;
                commentVo.page = Page.getPage(request.page, commentCount);
                childCommentVoList.push(commentVo);
              }
              commentVo.childrenComment = childCommentVoList;
            });
          commentVoList.push(commentVo);
        }
        return commentVoList;
      })
      .then((result) => {
        result.flatMap((commentVo) => {
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
          this.usersService.findByIds(userIdList).then((userIdMap) => {
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
          });
        });
        return result;
      });
  }

  async replyCommentByPostId(request: CommentRequest): Promise<CommentEntity> {
    let commentEntity: CommentEntity = new CommentEntity();
    commentEntity.rootCommentId =
      request.parentCommentId &&
      (await this.entityManager
        .createQueryBuilder()
        .from(CommentEntity, "comment")
        .where({
          postId: request.postId,
          postType: request.postType,
          validStatus: CommonValidStatus.VALID,
          parentCommentId: request.parentCommentId
        })
        .getOne()
        .then((result) => {
          return result.rootCommentId ?? result.parentCommentId ?? result.id;
        }));
    commentEntity.parentCommentId = request.parentCommentId;
    commentEntity.commentatorId = request.commentatorId;
    commentEntity.commentContent = request.commentContent;
    commentEntity.postId = request.postId;
    commentEntity.postType = request.postType;
    commentEntity.parentCommentatorId = request.parentCommentatorId;
    commentEntity.validStatus = CommonValidStatus.VALID;
    return this.entityManager.save(CommentEntity, commentEntity);
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
        return result.raw.affectedRows;
      });
  }
}
