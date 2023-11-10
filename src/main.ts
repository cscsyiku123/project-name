import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // let args = (req: Request, res: Response, next: NextFunction)=> {
  //   console.log(`接收到请求${req.url}`);
  //   next();
  // };
  // app.use(args)
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new GlobalInterceptor());
  // app.useGlobalGuards(new AuthGuard());
  app.enableCors();


  await app.listen(3000);
}

bootstrap();
