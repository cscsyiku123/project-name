import { Inject, Injectable } from "@nestjs/common";
import { AppService } from "./app.service";

@Injectable()
export class AppServicePropertyBaseInjection {

  getHello(): string {
    return 'i am property base injection';
  }
}
