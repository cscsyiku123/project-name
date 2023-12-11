import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { GlobalInterceptor } from "./utils/interceptor/global.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/entity/user.entity";
import { DataSource } from "typeorm";
import { UserSignInEntity } from "./users/entity/user.signIn.entity";
import { TypeOrmConfigService } from "./utils/conf/mysql.db.config";
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';
import { BarrageModule } from './barrage/barrage.module';
import envConfiguration from "./utils/conf/env.configuration";


@Module({
  imports: [
    ConfigModule.forRoot({
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
    TypeOrmModule.forFeature([UserEntity, UserSignInEntity]),
    AuthModule,
    VideoModule,
    CommentModule,
    BarrageModule
    // UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, TypeOrmConfigService, ConfigService, Reflector, GlobalInterceptor,
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
