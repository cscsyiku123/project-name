import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { CommonValidStatus, PostType } from "../../common/dto/constants";
import { formatTime } from "../../common/utils";

@Entity({ name: "barrage" })
@Index(["postId", "rootCommentId", "parentCommentId"])
@Index(["postId", "secondAppears"])
export class BarrageEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ name: "commentator_id", type: "bigint" })
  commentatorId: number;

  @Column({ name: "like_count", type: "bigint" })
  likeCount: number;

  @Column({ name: "unlike_count", type: "bigint" })
  unlikeCount: number;

  @Column({ name: "comment_content", length: 500 })
  commentContent: string;

  @Column({ name: "post_id", type: "bigint" })
  postId: number;

  @Column({ name: "post_type" })
  postType: PostType;

  @Column({ name: "parent_comment_id", type: "bigint" })
  parentCommentId?: number;

  @Column({ name: "root_comment_id", type: "bigint" })
  rootCommentId?: number;

  @Column({ name: "second_appears", type: "bigint" })
  secondAppears: number;

  @Column({ name: "valid_status", default: CommonValidStatus.VALID })
  validStatus: CommonValidStatus;

  @Column({
    name: "create_time", default: () => "CURRENT_TIMESTAMP", type: "datetime",
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => formatTime(value, "yyyy-MM-dd HH:mm:ss")
    }
  })
  createTime: Date;

  @Column({
    name: "update_time",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    type: "datetime",
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => formatTime(value, "yyyy-MM-dd HH:mm:ss")
    }
  })
  updateTime: Date;
}
