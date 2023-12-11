import { Module } from "@nestjs/common";
import { BarrageController } from "./barrage.controller";
import { BarrageService } from "./barrage.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import * as allEntity from "./entity";

@Module({
  controllers: [BarrageController],
  providers: [BarrageService],
  imports: [
    TypeOrmModule.forFeature(Object.values<EntityClassOrSchema>(allEntity))
  ]
})
export class BarrageModule {
}
