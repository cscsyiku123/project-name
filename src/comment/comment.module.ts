import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import * as allEntity from "./entity";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    TypeOrmModule.forFeature(Object.values<EntityClassOrSchema>(allEntity)),
    UsersModule
  ]
})
export class CommentModule {
}
