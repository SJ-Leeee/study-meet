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
import { Response, Request } from 'express';
import { JwtServiceAuthGuard } from './guards/jwt-service.guard';
import { GetAccessWithRefreshGuard } from './guards/get-access-with-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('/signup')
  async signupUser(@Body() signupUserDto: SignupUserDto): Promise<any> {
    return await this.authService.signupUser(signupUserDto);
  }

  // 로그인
  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginReqDto) {
    const { accessToken, refreshToken } =
      await this.authService.loginServiceUser(loginDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.header('Authorization', `Bearer ${accessToken}`);
    res.json({ message: '토큰 정상발급' });
  }

  // 로그아웃
  @Post('/logout')
  async logout(@Req() req: Request) {
    console.log(req);
  }

  // 리프레쉬토큰
  @UseGuards(GetAccessWithRefreshGuard)
  @Post('/refresh')
  async accessWithRefresh(@Req() req, @Res() res: Response) {
    const accessToken = await this.authService.accessWithRefresh(
      req.user.userId,
    );

    res.header('Authorization', `Bearer ${accessToken}`);
    res.json({ message: '액세스토큰발급' });
  }

  // 액세스토큰가드 테스트
  @UseGuards(JwtServiceAuthGuard)
  @Get()
  async getProfile(@Req() req) {
    // console.log(req.user);
    // return req;
  }
}
