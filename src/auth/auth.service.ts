import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupUserDto } from './dto/signupUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/Users';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './dto/tokenPayload.dto';
import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly authRepo: AuthRepository,
  ) {}

  // 회원가입
  async registrationUser(signupUserDto: SignupUserDto) {
    const user = await this.authRepo.findUserByEmail(signupUserDto.email);
    if (user) {
      throw new HttpException(
        `${user.email}은 이미 존재하는 이메일입니다.`,
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await this.hashPassword(signupUserDto.password);

    return this.authRepo.signupUser(signupUserDto, hashedPassword);
  }

  // 동일 이메일 검증
  async checkEmail(email: string) {
    const exUser = await this.userRepo.findOne({ where: { email } });
    if (exUser) {
      throw new HttpException('이미 존재하는 유저입니다.', HttpStatus.CONFLICT);
    }
    return;
  }

  // 비밀번호 암호화
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async validateServiceUser(email: string, getPassword: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        '존재하지 않는 email입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(await bcrypt.compare(getPassword, user.password))) {
      throw new HttpException('password를 확인해주세요.', HttpStatus.FORBIDDEN);
    }
    const { password, ...result } = user;

    return result;
  }

  loginServiceUser(user: UserEntity) {
    const payload = {
      id: user.userId,
      email: user.email,
      name: user.name,
      createAt: user.createdAt,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private createTokenPayload(userId: number): TokenPayload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
    };
  }
}
