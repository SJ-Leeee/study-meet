import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenRepository } from '../repositories/accessToken.repository';
import { BusinessException } from 'src/exception/businessException';

@Injectable()
export class adminAuthStrategy extends PassportStrategy(
  Strategy,
  'adminAuthStrategy',
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
    if (token.user.userRole !== 'admin') {
      throw new BusinessException(
        'auth',
        'access for admin',
        'access for admin',
        HttpStatus.FORBIDDEN,
      );
    }
    return token.user;
  }
}
