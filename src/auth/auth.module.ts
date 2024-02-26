import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
  controllers: [AuthController],
  providers: [
    AuthService,

    JwtServiceStrategy,
    JwtRefreshStrategy,
    adminAuthStrategy,

    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
  ],
  exports: [
    AuthService,

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
