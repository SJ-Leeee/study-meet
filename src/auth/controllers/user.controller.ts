import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
import { EditRoleDto } from '../dto/editRole.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'src/entities/Users';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 모든 유저 조회
  @ApiOperation({
    summary: '모든 유저 조회하기',
    description: '모든 유저 조회',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
  })
  @HttpCode(200)
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.getAllUsers();
  }

  // user Id로 특정 유저 조회
  @ApiOperation({
    summary: '모든 유저 조회하기',
    description: '모든 유저 조회',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
  })
  @ApiParam({ name: 'userId', description: '유저ID', example: 3 })
  @HttpCode(200)
  @Get('/:userId')
  async getUser(@Param('userId') userId: string): Promise<any> {
    return await this.userService.getUserById(+userId);
  }

  // 권한변경 api(ex 튜터, 관리자)
  @ApiOperation({
    summary: '유저 권한 변경',
    description: 'jwt로 인증 된 관리자가 유저 권한을 튜터나 관리자로 변경',
  })
  @ApiResponse({
    status: 200,
    description: '변경 성공',
  })
  @ApiParam({ name: 'userId', description: '유저ID', example: 6 })
  @ApiBearerAuth()
  @HttpCode(200)
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
  @ApiOperation({
    summary: '유저 삭제',
    description: 'jwt로 인증 된 관리자가 유저 삭제',
  })
  @ApiResponse({
    status: 200,
    description: '삭제 성공',
  })
  @ApiParam({ name: 'userId', description: '유저ID', example: 6 })
  @ApiBearerAuth()
  @HttpCode(200)
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return await this.userService.deleteUser(+userId);
  }
}
