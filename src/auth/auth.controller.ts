import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signupUser.dto';
import { LoginReqDto } from './dto/loginReq.dto';
import { Response } from 'express';
import { JwtServiceAuthGuard } from './guards/jwt-service.guard';
import { GetAccessWithRefreshGuard } from './guards/get-access-with-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signupUser(@Body() signupUserDto: SignupUserDto): Promise<any> {
    return await this.authService.signupUser(signupUserDto);
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginReqDto) {
    const { accessToken, refreshToken } =
      await this.authService.loginServiceUser(loginDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.header('Authorization', `Bearer ${accessToken}`);
    res.json({ message: '토큰 정상발급' });
  }

  // 테스트 내정보조회
  @UseGuards(JwtServiceAuthGuard)
  @Get()
  async getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(GetAccessWithRefreshGuard)
  @Get('/refresh')
  async accessTokenWithRefresh(@Req() req) {
    console.log(req.cookies['refreshToken']);
    return req.user;
  }
}
