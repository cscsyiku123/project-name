import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ResponseCodeConstants } from "../constants";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/auth/auth.decorator";
import { JwtService } from "@nestjs/jwt";
import { TResponse } from "../tresponse.dto";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  @Inject()
  private reflector: Reflector;
  @Inject()
  private jwtService: JwtService;

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    console.log("global interceptor...");
    let request = context.switchToHttp().getRequest();
    const now = Date.now();
    const roles = this.reflector?.get(Roles, context.getHandler());
    if (roles) {
      const token = this.extractTokenFromHeader(request);
      // if (!token) {
      //   return of(
      //     TResponse.getResponse(ResponseCodeConstants.NO_PERMISSION)
      //   );
      // }
      try {
        const payload = await this.jwtService.verifyAsync(token);
        request["user"] = payload;
      } catch {
        return of(
          TResponse.getResponse(ResponseCodeConstants.NO_PERMISSION)
        );
      }
    }

    return next.handle().pipe(
      map((response) => {
        console.log("map response...");
        return response instanceof TResponse
          ? response
          : TResponse.getSuccessResponse(response);
      }),
      catchError((err) => {
        console.error("catch error...");
        console.error(err.message);
        console.error(err);
        let errorResponse!: TResponse<null>;
        switch (err.status) {
          case 401:
            errorResponse = TResponse.getResponse(
              ResponseCodeConstants.NO_LOGIN
            );
            break;
          case 403:
            errorResponse = TResponse.getResponse(
              ResponseCodeConstants.NO_PERMISSION
            );
            break;
          default:
            errorResponse = TResponse.getResponseDetail(
              err && (err.status > 0 ? -err.status : err.status) || ResponseCodeConstants.SYSTEMERROR.code,
              err.message
            );
            break;
        }
        return of(errorResponse);
      }),
      tap(() => {
        console.log(
          `接收到 method:${request.method},url:${request.url} 请求,耗时:${
            Date.now() - now
          }ms`
        );
      })
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers["authorization"]?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
