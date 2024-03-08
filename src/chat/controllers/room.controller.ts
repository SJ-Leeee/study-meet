import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorator/user.decorator';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { RoomService } from '../services/room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // 내 룸 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyRooms(@User() user: ReqUserDto) {
    return await this.roomService.findAllRooms(+user.userId);
  }

  // 룸 만들기
  @UseGuards(JwtAuthGuard)
  @Post('/:secondId')
  async createRoom(
    @User() user: ReqUserDto,
    @Param('secondId') secondId: string,
  ) {
    await this.roomService.createRoom(user, +secondId);
  }
}
