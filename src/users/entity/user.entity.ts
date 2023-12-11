import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonValidStatus } from '../../utils/constants';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'avatar_image_link' })
  avatarImageLink: string;

  @Column({ name: 'valid_status', default: CommonValidStatus.VALID })
  validStatus: CommonValidStatus;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
