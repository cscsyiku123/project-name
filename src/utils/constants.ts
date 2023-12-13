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

export class Page {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPageCount: number;

  constructor(
    pageIndex: number,
    pageSize: number,
    totalCount: number,
    totalPageCount: number
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPageCount = totalPageCount;
  }

  public static getPage(requestPage: Page, totalCount: number) {
    let totalPageCount: number = Math.ceil(totalCount / requestPage.pageSize);
    return new Page(
      requestPage.pageIndex,
      requestPage.pageSize,
      totalCount,
      totalPageCount
    );
  }
}

export class TResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;

  private constructor(
    code: number,
    message: string,
    data: T,
    success: boolean
  ) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  public static getSuccessResponse<T>(data?: T): TResponse<T> {
    return this.getResponse(ResponseCodeConstants.SUCCESS, data);
  }

  public static getErrorResponse<T>(data?: T): TResponse<T> {
    return this.getResponse(ResponseCodeConstants.SYSTEMERROR, data);
  }

  public static getResponseDetail<T>(
    code: number,
    message: string,
    data?: T
  ): TResponse<T> {
    return new TResponse<T>(code, message, data, code >= 0 ? true : false);
  }

  public static getResponse<T>(
    responseCode: ResponseCodeConstants,
    data?: T
  ): TResponse<T> {
    return new TResponse<T>(
      responseCode.code,
      responseCode.message,
      data,
      responseCode.code >= 0
    );
  }
}
