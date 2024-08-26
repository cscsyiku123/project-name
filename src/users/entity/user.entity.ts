import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CommonValidStatus } from "../../common/dto/constants";

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ name: "avatar_image_link" })
  avatarImageLink: string;

  @Column({ name: "brief" })
  brief: string;

  @Column({ name: "valid_status", default: CommonValidStatus.VALID })
  validStatus: CommonValidStatus;

  @Column({ name: "create_time", default: () => "CURRENT_TIMESTAMP" })
  createTime: Date;

  @Column({ name: "update_time", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updateTime: Date;
}
