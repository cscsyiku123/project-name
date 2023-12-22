/**
 * 运行环境
 */

export enum EnvironmentType {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum AccountSignUpType {
  PASSWORD,
  SMS,
}

export enum CommonValidStatus {
  DELETE,
  VALID,
}

export enum PostType {
  VIDEO,
  JOKS,

}

export class ResponseCodeConstants {
  public static readonly SUCCESS = new ResponseCodeConstants(0, "成功");
  public static readonly SYSTEMERROR = new ResponseCodeConstants(-1, "系统错误");
  public static readonly NO_PERMISSION = new ResponseCodeConstants(-403, "无权限");
  public static readonly NO_LOGIN = new ResponseCodeConstants(-401, "未登录");
  public static readonly UPLOAD_FAIL = new ResponseCodeConstants(-405, "上传失败");

  code: number;
  message: string;

  private constructor(code: number, message: string) {

    this.code = code;
    this.message = message;
  }
}




