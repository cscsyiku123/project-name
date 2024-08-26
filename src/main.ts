import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { isDev } from "./common/conf/env.configuration";

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
  app.setGlobalPrefix("/api/pn");
  if (isDev) {
    const config = new DocumentBuilder()
      // .setTitle("pn")
      // .setDescription("The API description")
      .setVersion("1.0")
      // .addTag("pn")
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    });
    SwaggerModule.setup("/api/pn/swagger-ui.html", app, document);
    console.log(`开启Swagger文档：http://localhost:3100/api/pn/swagger-ui.html`);
  }
  // app.use("/files", serverStatic());
  await app.listen(3100);

}

bootstrap();
