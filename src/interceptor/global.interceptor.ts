import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of, throwError, timeout } from "rxjs";
import { tap,map,catchError } from 'rxjs/operators';
import { ResponseCodeConstants, TResponse } from "../config/constants";
import { NestApplication } from "@nestjs/core";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('global interceptor...');
    let request = context.getArgs()[0]
    const now = Date.now();
    return next
      .handle()
      .pipe(
        map(response => {
          console.log('map response...')
          return ( response instanceof TResponse ) ? response : TResponse.getSuccessResponse(response )
        }),
        catchError(err => {
          console.log('catch error...');
          console.log(err);
          let errorResponse!: TResponse<null>;
          switch (err.status) {
            case 403:
              errorResponse  = TResponse.getResponse(null,ResponseCodeConstants.NO_PERMISSION);
              break;
            default:
              errorResponse = TResponse.getErrorResponse(null);
              break;
          }
          return of(errorResponse)
        }),
        tap(() => {
          console.log(`接收到 method:${request.method},url:${request.url} 请求,耗时:${Date.now() - now}ms`)
        }),

      )
    ;
  }
}
