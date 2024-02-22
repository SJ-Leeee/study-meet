import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-strategy',
) {
  constructor(readonly configService: ConfigService) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      jwtFromRequest: (req) => {
        return req.cookies['refreshToken'];
      },
      ignoreExpiration: false, // 2
    });
  }
  async validate(payload: any) {
    console.log(payload);
    return payload;
  }
}
