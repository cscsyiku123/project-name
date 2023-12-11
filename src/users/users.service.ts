import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSignInDto } from "../auth/auth.signIn.dto";
import { UserSignInEntity } from "./entity/user.signIn.entity";

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private usersRepository: Repository<UserEntity>;
  @InjectRepository(UserSignInEntity)
  private usersSignInRepository: Repository<UserSignInEntity>;

  async findOneById(id: number): Promise<UserEntity | undefined> {
    this.usersRepository.createQueryBuilder().softDelete();
    return this.usersRepository.findOneBy(
      {
        id: id
      }
    );
  }

  async signInByPassword(signInDto: UserSignInDto): Promise<UserSignInEntity | undefined> {
    return this.usersSignInRepository.findOneBy(
      {
        account: signInDto.account,
        password: signInDto.password,
        signInType: signInDto.signInType
      }
    );
  }
}
