import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentType } from "../config/constants";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject()
  private readonly configService: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mysql",
      host: this.configService.get<string>("db.mysql.host"),
      port: this.configService.get<number>("db.mysql.port"),
      username: this.configService.get<string>("db.mysql.username"),
      password: this.configService.get<string>("db.mysql.password"),
      database: this.configService.get<string>("db.mysql.database"),
      entities: [],
      synchronize: process.env.NODE_ENV === EnvironmentType.DEVELOPMENT,
      logging: true,
      autoLoadEntities: true
    };
  }
}
