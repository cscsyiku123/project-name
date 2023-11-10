import { Body, Controller, Get, HttpException, Inject, Param, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
// import { DataSource, Repository } from "typeorm";
import { UserEntity } from "./db/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Controller()
export class AppController {
  @Inject()
  private readonly configService: ConfigService;
  // @InjectRepository(UserEntity)
  // private usersRepository: Repository<UserEntity>;
  @Inject()
  private readonly appService: AppService


  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get("/")
  getParams(@Query() params): string {
    console.log(params);
    return "get params:" + params["id"];
  }

  @Post()
  postParams(@Body() params): string {
    return "post params:" + params["id"];
  }

  @Get("/getException")
  getException(): string {
    throw new HttpException("forbidden1", 404);
  }

  @Get("/getConfigService")
  getConfigService(): string {
    return this.configService.get<string>("env")
  }
  // @Get("/getUser")
  // async getUser(): Promise<UserEntity[]> {
    // const users = await this.usersRepository.find()
    // return users;
  // }

  getHello() {
    return undefined;
  }
}
