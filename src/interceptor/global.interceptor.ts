import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from "@nestjs/common";
import { Observable, of, throwError, timeout } from "rxjs";
import { tap,map,catchError } from 'rxjs/operators';
import { ResponseCodeConstants, TResponse } from "../config/constants";
import { NestApplication, Reflector } from "@nestjs/core";
import { Roles } from "../auth/auth.decorator";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  @Inject()
  private reflector: Reflector
  @Inject()
  private jwtService: JwtService

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    console.log('global interceptor...');
    let request = context.switchToHttp().getRequest()
    const now = Date.now();
    const roles = this.reflector?.get(Roles, context.getHandler());
    if (roles) {
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        return of(TResponse.getResponse(null, ResponseCodeConstants.NO_PERMISSION));
      }
      try {
        const payload = await this.jwtService.verifyAsync(token);
        request["user"] = payload;
      } catch {
        return of(TResponse.getResponse(null, ResponseCodeConstants.NO_PERMISSION));
      }
    }

    return next
      .handle()
      .pipe(
        map(response => {
          console.log('map response...')
          return ( response instanceof TResponse ) ? response : TResponse.getSuccessResponse(response )
        }),
        catchError(err => {
          console.log('catch error...');
          console.log(err.message);
          let errorResponse!: TResponse<null>;
          switch (err.status) {
            case 401:
              errorResponse  = TResponse.getResponse(null,ResponseCodeConstants.NO_LOGIN);
              break;
            case 403:
              errorResponse  = TResponse.getResponse(null,ResponseCodeConstants.NO_PERMISSION);
              break;
            default:
              errorResponse = TResponse.getErrorResponseDetail(-err.status,err.message,null);
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
  private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers['authorization']?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
}
