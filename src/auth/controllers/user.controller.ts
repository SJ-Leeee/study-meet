import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserEntity } from 'src/entities/Users';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.getAllUsers();
  }

  @Get('/:userId')
  async getUser() {}

  @Patch('role/:userId')
  async editUserRole() {}

  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: string) {}
  // 관리자가 role설정하기
  // 관리자가 유저 삭제하기
  // 관리자가 유저 조회하기
}
