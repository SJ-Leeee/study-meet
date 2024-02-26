import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/Users';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
import { AccessTokenRepository } from './repositories/accessToken.repository';
import { RefreshTokenEntity } from 'src/entities/Refresh_token';
import { AccessTokenEntity } from 'src/entities/Access_token';
import { JwtServiceStrategy } from './stradegies/jwtAuth.strategy';
import { JwtRefreshStrategy } from './stradegies/jwtRefresh.strategy';
import { GetJtiMiddleware } from './middlewares/getJti.middleware';
import { adminAuthStrategy } from './stradegies/adminAuth.strategy';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      AccessTokenEntity,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    UserService,

    JwtServiceStrategy,
    JwtRefreshStrategy,
    adminAuthStrategy,

    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
  ],
  exports: [
    AuthService,
    UserService,

    JwtServiceStrategy,
    JwtRefreshStrategy,
    adminAuthStrategy,

    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetJtiMiddleware).forRoutes('auth/logout');
  }
}
