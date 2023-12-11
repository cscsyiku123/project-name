import { Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { UserSignInDto } from '../auth/auth.signIn.dto';
import { UserSignInEntity } from './entity/user.signIn.entity';
import { InjectEntityManager } from '@nestjs/typeorm/dist/common/typeorm.decorators';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private usersRepository: Repository<UserEntity>;
  @InjectRepository(UserSignInEntity)
  private usersSignInRepository: Repository<UserSignInEntity>;

  @InjectEntityManager()
  private entityManager: EntityManager;

  async findOneById(id: number): Promise<UserEntity | undefined> {
    return this.usersRepository.findOneBy({
      id: id,
    });
  }

  async findOneByIds(
    ids: number[],
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

  async signInByPassword(
    signInDto: UserSignInDto,
  ): Promise<UserSignInEntity | undefined> {
    return this.usersSignInRepository.findOneBy({
      account: signInDto.account,
      password: signInDto.password,
      signInType: signInDto.signInType,
    });
  }
}
