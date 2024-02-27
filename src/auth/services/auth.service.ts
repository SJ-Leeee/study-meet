import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupUserDto } from '../dto/signupUser.dto';
import { UserEntity } from 'src/entities/Users';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../dto/tokenPayload.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/user.repository';
import { LoginReqDto } from '../dto/loginReq.dto';
import { ConfigService } from '@nestjs/config';
import { AccessTokenRepository } from '../repositories/accessToken.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { BusinessException } from 'src/exception/businessException';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private configService: ConfigService,
    private readonly accessTokenRepo: AccessTokenRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
  ) {}

  // 회원가입
  async signupUser(signupUserDto: SignupUserDto) {
    const user = await this.userRepo.findUserByEmail(signupUserDto.email);
    if (user) {
      throw new BusinessException(
        'auth',
        `${user.email}은 이미 사용중입니다.`,
        `${user.email} is exist`,
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await this.hashPassword(signupUserDto.password);

    return this.userRepo.signupUser(signupUserDto, hashedPassword);
  }

  // 회원가입 - 비밀번호 해싱
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  // 로그인
  async loginServiceUser(dto: LoginReqDto): Promise<any> {
    const user = await this.loginValidateUser(dto.email, dto.password);
    const payload = this.createTokenPayload(user.userId);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user, payload),
      this.createRefreshToken(user, payload),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  // 로그인 - 자격증명
  private async loginValidateUser(
    email: string,
    getPassword: string,
  ): Promise<UserEntity> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(getPassword, user.password))) {
      throw new BusinessException(
        'auth',
        'email, password is incorrect',
        'email, password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }

  // 로그인 - 액세스토큰 저장
  private async createAccessToken(user: UserEntity, payload: TokenPayload) {
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    const accessToken = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.accessTokenRepo.saveAccessToken(
      user,
      accessToken,
      payload.jti,
      expiresAt,
    );

    return accessToken;
  }

  // 로그인 - 리프래시토큰 저장
  private async createRefreshToken(user: UserEntity, payload: TokenPayload) {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const refreshToken = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.refreshTokenRepo.saveRefreshToken(
      user,
      refreshToken,
      payload.jti,
      expiresAt,
    );

    return refreshToken;
  }

  // 로그인 - 토큰 페이로드 생성
  private createTokenPayload(userId: number): TokenPayload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
    };
  }

  // 로그인 - 만료시간 설정
  private calculateExpiry(expiry: string): Date {
    let expiresInMilliseconds = 0;

    if (expiry.endsWith('d')) {
      const days = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = days * 24 * 60 * 60 * 1000;
    } else if (expiry.endsWith('h')) {
      const hours = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = hours * 60 * 60 * 1000;
    } else if (expiry.endsWith('m')) {
      const minutes = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = minutes * 60 * 1000;
    } else if (expiry.endsWith('s')) {
      const seconds = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = seconds * 1000;
    } else {
      throw new HttpException('jwt 오류', HttpStatus.NOT_FOUND);
    }

    return new Date(Date.now() + expiresInMilliseconds);
  }

  // 리프레시로 액세스발급
  async accessWithRefresh(userId: number): Promise<string> {
    const user = await this.userRepo.findUserById(userId);
    const payload = this.createTokenPayload(userId);

    const accessToken = await this.createAccessToken(user, payload);
    return accessToken;
  }

  // 로그아웃
  async logout(accessToken: string, refreshToken: string): Promise<void> {
    const [jtiAccess, jtiRefresh] = await Promise.all([
      this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
      this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
    ]);

    await this.tokenBlackList(jtiAccess.jti, jtiRefresh.jti);
  }

  private async tokenBlackList(
    accessJti: string,
    refreshJti: string,
  ): Promise<any> {
    return Promise.all([
      this.accessTokenRepo.blacklist(accessJti),
      this.refreshTokenRepo.blacklist(refreshJti),
    ]);
  }
}
