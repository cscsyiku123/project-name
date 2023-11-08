import { Reflector } from '@nestjs/core';

enum Role {
  ADMIN,
  Login,

}


export const Roles = Reflector.createDecorator<Role[]>();
