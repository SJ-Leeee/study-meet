import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserEntity, UserRole } from 'src/entities/Users';
import { AdminAuthGuard } from '../guards/adminAuth.guard';
import { EditRoleDto } from '../dto/editRole.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 모든 유저 조회
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.getAllUsers();
  }

  // user Id로 특정 유저 조회
  @Get('/:userId')
  async getUser(@Param('userId') userId: string): Promise<any> {
    return await this.userService.getUserById(+userId);
  }

  @UseGuards(AdminAuthGuard)
  @Put('/:userId/role')
  async editUserRole(
    @Param('userId') userId: string,
    @Body() role: EditRoleDto,
  ): Promise<any> {
    console.log(role);
    return await this.userService.editUserRole(+userId, role);
  }

  // @Delete('/:userId')
  // async deleteUser(@Param('userId') userId: string) {}
  // 관리자가 role설정하기
  // 관리자가 유저 삭제하기
  // 관리자가 유저 조회하기
}
