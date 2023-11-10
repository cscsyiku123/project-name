import { Reflector } from '@nestjs/core';

export enum Role {
  ADMIN,
  Login,

}


export const Roles = Reflector.createDecorator<Role[]>();
