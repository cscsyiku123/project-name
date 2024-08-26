import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { GlobalInterceptor } from "./common/global.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { TypeOrmConfigService } from "./common/conf/mysql.db.config";
import { VideoModule } from "./video/video.module";
import { CommentModule } from "./comment/comment.module";
import { BarrageModule } from "./barrage/barrage.module";
import envConfiguration from "./common/conf/env.configuration";
import * as allUserEntity from "./users/entity";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return [
          {
            rootPath: join(__dirname, "..", configService.get<string>("file.upload.dir")),
            serveRoot: configService.get<string>("file.upload.dir"),
            cacheControl: true,
            etag: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            lastModified: true
          }
        ];
      },
      inject: [ConfigService],
      imports: [ConfigModule]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration]
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
      imports: [ConfigModule]
    }),
    TypeOrmModule.forFeature(Object.values(allUserEntity)),
    AuthModule,
    VideoModule,
    CommentModule,
    BarrageModule
    // UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypeOrmConfigService,
    ConfigService,
    Reflector,
    GlobalInterceptor,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor
    }
  ]
})
export class AppModule {
}
