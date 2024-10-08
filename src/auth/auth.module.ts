import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnvironmentType } from "../common/dto/constants";

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  imports: [
    AuthModule,
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          verifyOptions: {
            ignoreExpiration:
              process.env.NODE_ENV === EnvironmentType.DEVELOPMENT,
          },
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn'),
          },
        };
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
