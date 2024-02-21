import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signupUser.dto';
import { LoginReqDto } from './dto/loginReq.dto';
import { JwtServiceAuthGuard } from './guards/jwt-service.guard';
import { UserEntity } from 'src/entities/Users';
import { LoginResDto } from './dto/loginRes.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signupUser(@Body() signupUserDto: SignupUserDto): Promise<any> {
    return await this.authService.signupUser(signupUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.loginServiceUser(loginDto);
  }

  // 테스트 내정보조회
  @Get()
  @UseGuards(JwtServiceAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }
}
