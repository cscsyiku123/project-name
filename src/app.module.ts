import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppServicePropertyBaseInjection } from "./app.service-property-base-injection";
import configuration from "./config/util/configuration";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./config/db.config";
import { DataSource } from "typeorm";
import { UserEntity } from "./db/entity/user.entity";



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
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [AppController],
  providers: [AppService,AppServicePropertyBaseInjection,TypeOrmConfigService],
})
export class AppModule {}
