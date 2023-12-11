import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as allEntity from './entity';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature(Object.values<EntityClassOrSchema>(allEntity)),
  ],
})
export class UsersModule {}
