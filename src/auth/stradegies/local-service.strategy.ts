import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalServiceStrategy extends PassportStrategy(
  Strategy,
  'local-strategy',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      // 기본 프로퍼티를 변경
    });
  }

  async validate(email: string, password: string): Promise<any> {
    return await this.authService.validateServiceUser(email, password);
  }
}

// passport의 local strategy 전략을 상속받아 사용한다.
// passport-local 전략에서 super의 기본프로퍼티는 username과 password가 사용된다
// 반드시 validate라는 함수를 사용하도록 한다.
