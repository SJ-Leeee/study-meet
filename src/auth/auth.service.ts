import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { registrationUserDto } from './dto/registrationUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/Users';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  // 회원가입
  async registrationUser(userDto) {
    const user = { ...userDto };
    await this.userRepo.save(user);
    const { password, ...result } = user;
    return result;
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
  async hashPassword(password: string) {
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
}
