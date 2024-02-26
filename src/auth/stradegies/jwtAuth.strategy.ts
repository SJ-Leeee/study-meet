import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BusinessException } from 'src/exception/businessException';
import { AccessTokenRepository } from '../repositories/accessToken.repository';

@Injectable()
export class JwtServiceStrategy extends PassportStrategy(
  Strategy,
  'jwtAuthStrategy',
) {
  constructor(
    readonly configService: ConfigService,
    private readonly accessRepo: AccessTokenRepository,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 2
    });
  }
  async validate(payload: any) {
    const token = await this.accessRepo.getAccessWithJti(payload.jti);
    if (!token.available || !token) {
      throw new BusinessException(
        'token',
        'invalid token',
        'invalid token',
        HttpStatus.BAD_REQUEST,
      );
    }
    return token.user;
  }
}
