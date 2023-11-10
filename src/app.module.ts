import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from "./config/configuration";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./db/db.config";
import { DataSource } from "typeorm";
import { UserEntity } from "./db/entity/user.entity";
import { AuthGuard } from "./auth/auth.guard";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
      imports: [ConfigModule],
    }),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService,TypeOrmConfigService,ConfigService,Reflector,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }],
})
export class AppModule {}
