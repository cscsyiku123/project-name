import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entity/user.entity";
import { EntityManager, In } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { AuthRequest } from "../auth/auth.request";
import { AccountEntity } from "./entity/account.entity";

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {

  @InjectEntityManager()
  private entityManager: EntityManager;

  async findOneById(id: number): Promise<UserEntity | undefined> {
    return this.entityManager.findOneBy(UserEntity, {
      id: id
    });
  }

  async findByIds(
    ids: number[]
  ): Promise<Map<number, UserEntity> | undefined> {
    return this.entityManager
      .find(UserEntity, { where: { id: In(ids) } })
      .then((users: UserEntity[]) => {
        let map = new Map<number, UserEntity>();
        for (let user of users) {
          map.set(user.id, user);
        }
        return map;
      });
  }

  async findOneAccount(authRequst: AuthRequest): Promise<AccountEntity | undefined> {
    return this.entityManager.findOneBy(AccountEntity, {
      account: authRequst.account,
      signUpType: authRequst.signInType
    });
  }

  async addAccount(authRequst: AuthRequest): Promise<AccountEntity | undefined> {
    return this.entityManager.save(AccountEntity, {
      account: authRequst.account,
      password: authRequst.password,
      signUpType: authRequst.signInType,
      userId: authRequst.userId
    });
  }

  async addUser(authRequest: AuthRequest) {
    return this.entityManager.save(UserEntity, {
      name: "一小枚用户",
      avatarImageLink: "/default_avatar.png"
    });
  }
}
