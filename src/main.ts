import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction } from "express";
import { HttpExceptionFilter } from "./interceptor/http-exception.filter";
import { GlobalInterceptor } from "./interceptor/global.interceptor";
import { AuthGuard } from "./auth/auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // let args = (req: Request, res: Response, next: NextFunction)=> {
  //   console.log(`接收到请求${req.url}`);
  //   next();
  // };
  // app.use(args)
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new GlobalInterceptor());
  app.useGlobalGuards(new AuthGuard());
  app.enableCors();



  await app.listen(3000);
}
bootstrap();
