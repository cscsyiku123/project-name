import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  const config = new DocumentBuilder()
      .setTitle('pn')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('pn')
      .build();
  const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/swagger-ui.html', app, document);
  await app.listen(3000);
}

bootstrap();
