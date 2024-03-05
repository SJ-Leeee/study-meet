import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupUserDto } from '../dto/signupUser.dto';
import { LoginReqDto } from '../dto/loginReq.dto';
import { Response, Request } from 'express';
import { JwtRefreshGuard } from '../../guards/jwtRefresh.guard';

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

  //로그아웃
  @Post('/logout')
  async logout(@Req() req): Promise<void> {
    await this.authService.logout(req.accessToken, req.refreshToken);
  }

  // 액세스토큰 재발급
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async accessWithRefresh(@Req() req, @Res() res: Response) {
    const accessToken = await this.authService.accessWithRefresh(
      req.user.userId,
    );

    res.header('Authorization', `Bearer ${accessToken}`);
    res.json({ message: '액세스토큰발급' });
  }
}
