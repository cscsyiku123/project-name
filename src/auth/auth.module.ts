import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentType } from '../utils/constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtModule],
  imports: [
    AuthModule,
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        ignoreExpiration: process.env.NODE_ENV === EnvironmentType.DEVELOPMENT,
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
