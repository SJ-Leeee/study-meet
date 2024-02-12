import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registrationUserDto } from './dto/registrationUser.dto';

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
}
