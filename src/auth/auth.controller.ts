import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registrationUserDto } from './dto/registrationUser.dto';
import { LocalServiceAuthGuard } from './guards/local-service.guard';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtServiceAuthGuard } from './guards/jwt-service.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async registrationUser(@Body() userDto: registrationUserDto) {
    await this.authService.checkEmail(userDto.email);

    const hashedPassword = await this.authService.hashPassword(
      userDto.password,
    );
    userDto.password = hashedPassword;
    return await this.authService.registrationUser(userDto);
  }

  // 테스트중
  @Post('/login')
  @UseGuards(LocalServiceAuthGuard)
  async login(@Req() req, @Body() loginDto: LoginUserDto) {
    const token = this.authService.loginServiceUser(req.user);
    return token;
  }

  // 테스트 내정보조회
  @Get()
  @UseGuards(JwtServiceAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }
}
