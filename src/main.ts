import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction } from "express";
import { HttpExceptionFilter } from "./config/http-exception.filter";
import { GlobalInterceptor } from "./config/global.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let args = (req: Request, res: Response, next: NextFunction)=> {
    console.log(`接收到请求${req.url}`);
    next();
  };
  app.use( args)
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new GlobalInterceptor());


  await app.listen(3000);
}
bootstrap();
