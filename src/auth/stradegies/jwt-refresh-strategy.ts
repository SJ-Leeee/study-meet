import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { BusinessException } from 'src/exception/businessException';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-strategy',
) {
  constructor(
    readonly configService: ConfigService,
    private readonly refreshRepo: RefreshTokenRepository,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      jwtFromRequest: (req) => {
        return req.cookies['refreshToken'];
      },
      ignoreExpiration: false, // 2
    });
  }
  async validate(payload: any) {
    const token = await this.refreshRepo.getRefreshWithJti(payload.jti);
    if (!token.available || !token) {
      throw new BusinessException(
        'token',
        'invalid token',
        'invalid token',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(token);
    return token.user;
  }
}
