export class UserVo {
  userId: number;
  userName: string;
  avatarImageLink: string;
  brief: string;

  constructor(userId: number, userName: string, avatarImageLink: string) {
    this.userId = userId;
    this.userName = userName;
    this.avatarImageLink = avatarImageLink;
  }
}