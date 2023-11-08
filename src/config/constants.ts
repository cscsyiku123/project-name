
/**
 * 运行环境
 */

export enum EnvironmentType {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}


export class ResponseCodeConstants {
  public static readonly SUCCESS = new ResponseCodeConstants(0, "成功");
  public static readonly ERROR = new ResponseCodeConstants(-1, "系统错误");

  code: number;
  message: string;

  private constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

export class TResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;

  private constructor(code: number, message: string, data: T, success: boolean) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  public  static  getSuccessResponse<T>(data: T): TResponse<T> {
    return new TResponse<T>(ResponseCodeConstants.SUCCESS.code, ResponseCodeConstants.SUCCESS.message, data, ResponseCodeConstants.SUCCESS.code >= 0);
  }
  public static getErrorResponse<T>(data: T): TResponse<T> {
    return new TResponse<T>(ResponseCodeConstants.ERROR.code, ResponseCodeConstants.ERROR.message, data, ResponseCodeConstants.ERROR.code >= 0);
  }

  public static getResponse<T>(data: T, responseCode: ResponseCodeConstants): TResponse<T> {
    return new TResponse<T>(responseCode.code, responseCode.message, data, responseCode.code >= 0);
  }
}
