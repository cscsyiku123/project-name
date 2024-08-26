import { Reflector } from "@nestjs/core";

export enum RoleEnum {
  ADMIN,
  USER,
}

export const Role = Reflector.createDecorator<RoleEnum[]>();
