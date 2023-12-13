import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AccountSignUpType, CommonValidStatus } from "../../utils/constants";

@Entity({ name: "account" })
@Index(["userId", "signUpType"], { unique: true })
@Index(["account", "signUpType"], { unique: true })
export class AccountEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: bigint;

  @Column({ name: "user_id", type: "bigint" })
  userId: number;

  @Column({ length: 50, comment: "账号" })
  account: string;

  @Column({ name: "sign_up_type" })
  signUpType: AccountSignUpType;

  @Column({ length: 50, comment: "密码" })
  password: string;

  @Column({ name: "valid_status", default: CommonValidStatus.VALID })
  validStatus: CommonValidStatus;

  @CreateDateColumn({ name: "create_time" })
  createTime: Date;

  @UpdateDateColumn({ name: "update_time" })
  updateTime: Date;
}
