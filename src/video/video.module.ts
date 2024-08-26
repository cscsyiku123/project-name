import { Module } from "@nestjs/common";
import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import * as allEntity from "./entity";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [
    TypeOrmModule.forFeature(Object.values<EntityClassOrSchema>(allEntity)),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          filename: (req, file, callback) => {
            const path =
              Date.now() +
              "-" +
              Math.round(Math.random() * 1e10) +
              extname(file.originalname);
            callback(null, path);
          },
          destination: join(__dirname, "../../", configService.get<string>("file.upload.dir"))
        })
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ]
})
export class VideoModule {
}
