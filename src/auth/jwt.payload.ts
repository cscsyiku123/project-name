export class JwtPayload {
  sub: number;
  userId: number;
  userName: string;
  avatarImageLink: string;

  constructor(sub: number, userId: number, userName: string, avatarImageLink: string) {
    this.sub = sub;
    this.userId = userId;
    this.userName = userName;
    this.avatarImageLink = avatarImageLink;
  }
}