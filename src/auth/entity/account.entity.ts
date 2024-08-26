import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { AccountSignUpType, CommonValidStatus } from "../../common/dto/constants";

@Entity({ name: "account" })
@Index(["userId", "signUpType"], { unique: true })
@Index(["accountNumber", "signUpType"], { unique: true })
export class AccountEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: bigint;

  @Column({ name: "user_id", type: "bigint" })
  userId: number;

  @Column({ length: 50, comment: "账号" })
  accountNumber: string;

  @Column({ name: "sign_up_type" })
  signUpType: AccountSignUpType;

  @Column({ length: 50, comment: "密码" })
  password: string;

  @Column({ name: "valid_status", default: CommonValidStatus.VALID })
  validStatus: CommonValidStatus;

  @Column({ name: "create_time", default: () => "CURRENT_TIMESTAMP" })
  createTime: Date;

  @Column({ name: "update_time", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updateTime: Date;
}
