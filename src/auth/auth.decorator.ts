import { Reflector } from "@nestjs/core";

export enum Role {
  ADMIN,
  LOGIN,

}


export const Roles = Reflector.createDecorator<Role[]>();
