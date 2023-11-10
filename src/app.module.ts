import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmConfigService } from "./db/db.config";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { GlobalInterceptor } from "./interceptor/global.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./db/entity/user.entity";
import { DataSource } from "typeorm";


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
      imports: [ConfigModule]
    }),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule
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
