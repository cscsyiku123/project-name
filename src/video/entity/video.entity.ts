import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonValidStatus } from "../../utils/constants";

@Entity({ name: "video" })
export class VideoEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ name: "brief" })
  brief: string;

  @Column({ name: "cover_image_link" })
  coverImageLink: string;

  @Column({ name: "category_tag" })
  categoryTag: string;

  @Column({ name: "second_duration", type: "bigint" })
  secondDuration: number;

  @Column({ name: "play_count", type: "bigint" })
  playCount: number;

  @Column({ name: "like_count", type: "bigint" })
  likeCount: number;

  @Column({ name: "follow_count", type: "bigint" })
  followCount: number;

  @Column({ name: "comment_count", type: "bigint" })
  commentCount: number;

  @Column({ name: "share_count", type: "bigint" })
  shareCount: number;

  @Column({ name: "play_link" })
  playLink: string;

  @Column({ name: "author_id", type: "bigint" })
  authorId: number;

  @Column({ name: "valid_status", default: CommonValidStatus.VALID })
  validStatus: CommonValidStatus;

  @CreateDateColumn({ name: "create_time" })
  createTime: Date;

  @UpdateDateColumn({ name: "update_time" })
  updateTime: Date;
}
