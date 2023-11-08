import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of, throwError } from "rxjs";
import { tap,map,catchError } from 'rxjs/operators';
import { TResponse } from "../config/constants";
import { NestApplication } from "@nestjs/core";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        map(response => ( response instanceof TResponse ) ? response : TResponse.getSuccessResponse(response )),
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
        catchError(err => of(TResponse.getErrorResponse(err))),
      )
    ;
  }
}
