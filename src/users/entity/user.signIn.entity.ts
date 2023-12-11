import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonValidStatus, UserSignInType } from '../../utils/constants';

@Entity('user_sign_in')
@Index(['signInType', 'account'], { unique: true })
export class UserSignInEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'sign_in_type' })
  signInType: UserSignInType;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column({ name: 'valid_status', default: CommonValidStatus.VALID })
  validStatus: CommonValidStatus;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
