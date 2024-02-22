import { Module } from '@nestjs/common';
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
import { JwtServiceStrategy } from './stradegies/jwt-service.stratedy';
import { JwtRefreshStrategy } from './stradegies/jwt-refresh-strategy';

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
    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
  ],
  exports: [
    AuthService,
    JwtServiceStrategy,
    JwtRefreshStrategy,
    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
  ],
})
export class AuthModule {}

// session:false로 둔 이유는 토큰기반인증을 사용할 것이기 때문이다.
// JwtModule.registerAsync({}) 도 있다. 이것은 db와 접근할 경우, 비동기로 환경변수를 가져올 경우 유용하다.
