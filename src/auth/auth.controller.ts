import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registrationUserDto } from './dto/registrationUser.dto';
import { LocalServiceAuthGuard } from './guards/local-service.guard';

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
  async login(@Req() req) {
    return req.user;
  }
}
