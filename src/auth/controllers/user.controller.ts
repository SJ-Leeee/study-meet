import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserEntity } from 'src/entities/Users';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
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

  // 권한변경 api(ex 튜터, 관리자)
  @UseGuards(AdminAuthGuard)
  @Put('/:userId/role')
  async editUserRole(
    @Param('userId') userId: string,
    @Body() role: EditRoleDto,
  ): Promise<void> {
    await this.userService.editUserRole(+userId, role);
  }

  // 유저삭제 api
  @UseGuards(AdminAuthGuard)
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return await this.userService.deleteUser(+userId);
  }
}
