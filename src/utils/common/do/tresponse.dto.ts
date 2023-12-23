import { ResponseCodeConstants } from "../../constants";

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