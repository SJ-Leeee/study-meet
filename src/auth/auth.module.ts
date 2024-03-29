import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/Users';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
import { AccessTokenRepository } from './repositories/accessToken.repository';
import { RefreshTokenEntity } from 'src/entities/Refresh_token';
import { AccessTokenEntity } from 'src/entities/Access_token';
import { JwtServiceStrategy } from './stradegies/jwtAuth.strategy';
import { JwtRefreshStrategy } from './stradegies/jwtRefresh.strategy';
import { adminAuthStrategy } from './stradegies/adminAuth.strategy';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UploadModule } from 'src/upload/upload.module';
import { TutorController } from './controllers/tutor.controller';
import { TutorService } from './services/tutor.service';
import { TutorRepository } from './repositories/tutor.repository';
import { Tutor_infoEntity } from 'src/entities/Tutor_info';
import { Tutor_certification_imageEntity } from 'src/entities/Tutor_certification_image';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      AccessTokenEntity,
      Tutor_infoEntity,
      Tutor_certification_imageEntity,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
    }),
    UploadModule,
  ],
  controllers: [AuthController, UserController, TutorController],
  providers: [
    AuthService,
    UserService,
    TutorService,

    JwtServiceStrategy,
    JwtRefreshStrategy,
    adminAuthStrategy,

    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
    TutorRepository,
  ],
  exports: [
    AuthService,
    UserService,
    TutorService,

    JwtServiceStrategy,
    JwtRefreshStrategy,
    adminAuthStrategy,

    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
  ],
})
export class AuthModule {}
