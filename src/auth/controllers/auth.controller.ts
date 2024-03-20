import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiHeader,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '회원가입',
  })
  @ApiBody({ type: SignupUserDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @HttpCode(201)
  @Post('/signup')
  async signupUser(@Body() signupUserDto: SignupUserDto): Promise<any> {
    await this.authService.signupUser(signupUserDto);
    return { message: '회원가입 성공' };
  }

  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @ApiBody({ type: LoginReqDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
  })
  @HttpCode(200)
  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginReqDto) {
    const { accessToken, refreshToken } =
      await this.authService.loginServiceUser(loginDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.header('Authorization', `Bearer ${accessToken}`);
    res.json({ message: '토큰 정상발급' });
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '헤더에 accessToken 쿠키에 refreshToken 필요',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
  })
  @ApiResponse({
    status: 403,
    description: 'jwt 토큰오류',
  })
  @HttpCode(200)
  @Post('/logout')
  async logout(@Req() req): Promise<any> {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = req.headers.authorization;

    await this.authService.logout(accessToken, refreshToken);
    return { message: '로그아웃 성공' };
  }

  // 액세스토큰 재발급
  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description:
      '리프레시 토큰을 이용한 액세스 토큰 재발급 헤더에 accessToken 필요',
  })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    status: 200,
    description: '헤더에 새로운 액세스토큰 발급',
  })
  @HttpCode(200)
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
